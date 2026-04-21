/**
 * Persistent database layer backed by Supabase (PostgreSQL).
 * Replaces the ephemeral in-memory store.js for Vercel deployments.
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // service_role key — server-side only, never exposed to client
);

const db = {
  // ─── Users ────────────────────────────────────────────────────────────────
  async findUserByEmail(email) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    return data || null;
  },

  async findUserById(id) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return data || null;
  },

  async createUser({ email, passwordHash, role, name = '', companyName = '', schoolId = null }) {
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: passwordHash, role, name, bio: '', company_name: companyName, school_id: schoolId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateUser(id, updates) {
    const patch = {};
    if (updates.name        != null) patch.name         = updates.name;
    if (updates.bio         != null) patch.bio          = updates.bio;
    if (updates.photo       != null) patch.photo        = updates.photo;
    if (updates.cv_file     != null) patch.cv_file      = updates.cv_file;
    if (updates.company_name != null) patch.company_name = updates.company_name;

    if (Object.keys(patch).length === 0) {
      return db.findUserById(id);
    }

    const { data, error } = await supabase
      .from('users')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data;
  },

  // ─── Internships ──────────────────────────────────────────────────────────
  async getAllInternships() {
    const { data } = await supabase
      .from('internships')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  },

  async createInternship({ companyId, company, role, location, duration, description, requirements, tags, logo }) {
    const { data, error } = await supabase
      .from('internships')
      .insert({
        company_id: companyId, company, role, location, duration, description,
        requirements: requirements || [],
        tags: tags || [],
        logo: logo || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async findInternshipById(id) {
    const { data } = await supabase
      .from('internships')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return data || null;
  },

  async deleteInternship(id) {
    await supabase.from('internships').delete().eq('id', id);
  },

  // ─── Applications ─────────────────────────────────────────────────────────
  async getApplicationsByStudent(studentId) {
    const { data } = await supabase
      .from('applications')
      .select('*, internship:internships(*)')
      .eq('student_id', studentId)
      .order('applied_at', { ascending: false });
    return data || [];
  },

  async getApplicationsByCompany(companyId) {
    // Step 1: get this company's internship IDs
    const { data: internships } = await supabase
      .from('internships')
      .select('id')
      .eq('company_id', companyId);

    if (!internships || internships.length === 0) return [];
    const ids = internships.map(i => i.id);

    // Step 2: get applications for those internships + join student + internship
    const { data } = await supabase
      .from('applications')
      .select('*, internship:internships(*), student:users(*)')
      .in('internship_id', ids)
      .order('applied_at', { ascending: false });
    return data || [];
  },

  async findApplication(studentId, internshipId) {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('student_id', studentId)
      .eq('internship_id', internshipId)
      .maybeSingle();
    return data || null;
  },

  async createApplication({ studentId, internshipId, message }) {
    const { data, error } = await supabase
      .from('applications')
      .insert({ student_id: studentId, internship_id: internshipId, message, status: 'pending' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateApplicationStatus(id, status) {
    await supabase.from('applications').update({ status }).eq('id', id);
  },

  // ─── Schools ──────────────────────────────────────────────────────────────
  async getAllSchools() {
    const { data } = await supabase
      .from('users')
      .select('id, name, company_name, email')
      .eq('role', 'school')
      .order('name');
    return (data || []).map(s => ({ id: s.id, name: s.name, domain: s.company_name, email: s.email }));
  },

  async getStudentsBySchool(schoolId) {
    const { data: students } = await supabase
      .from('users')
      .select('id, name, email, bio, photo, created_at')
      .eq('role', 'student')
      .eq('school_id', schoolId)
      .order('name');

    if (!students || students.length === 0) return [];

    const studentIds = students.map(s => s.id);

    const { data: applications } = await supabase
      .from('applications')
      .select('id, student_id, status, applied_at, internship:internships(id, role, company, location)')
      .in('student_id', studentIds)
      .order('applied_at', { ascending: false });

    const apps = applications || [];

    return students.map(s => ({
      ...s,
      applications: apps
        .filter(a => a.student_id === s.id)
        .map(a => ({ id: a.id, status: a.status, applied_at: a.applied_at, internship: a.internship })),
      isPlaced: apps.some(a => a.student_id === s.id && a.status === 'accepted'),
      applicationCount: apps.filter(a => a.student_id === s.id).length,
    }));
  },
};

module.exports = db;
