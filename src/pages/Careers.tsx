import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, Lock } from 'lucide-react';
import { motion } from 'motion/react';

// Types
type AppStatus = 'open' | 'closing-soon' | 'closed';

interface FormData {
  // Personal
  fullName: string;
  phone: string;
  email: string;
  suburb: string;
  legalWork: string;
  // Availability
  availabilityDays: string;
  availabilityHours: string;
  weekendShifts: string;
  startDate: string;
  // Experience
  experience: string;
  lastJobs: string;
  tasks: string;
  equipment: string;
  checklist: string;
  // Skills
  qualityWork: string;
  feedback: string;
  teamwork: string;
  safety: string;
  // Reliability
  dismissals: string;
  respect: string;
  whyFit: string;
}

const SUBURBS = ['Albury', 'Lavington', 'Glenroy', 'Springdale Heights'];

export default function Careers({ appStatus }: { appStatus: AppStatus }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          We're always looking for reliable, hardworking individuals to join the Reuben's Cleaning family.
        </p>
      </div>

      {/* Status Banner */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={`rounded-xl p-4 flex items-center gap-3 ${
            appStatus === 'open' ? 'bg-green-50 text-green-800 border border-green-100' :
            appStatus === 'closing-soon' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
            'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            {appStatus === 'open' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {appStatus === 'closing-soon' && <Clock className="w-5 h-5 text-amber-600" />}
            {appStatus === 'closed' && <AlertCircle className="w-5 h-5 text-slate-500" />}
            
            <span className="font-medium">
              {appStatus === 'open' && "Staff applications are currently open – apply now!"}
              {appStatus === 'closing-soon' && "Staff applications are closing soon – submit your application before the deadline!"}
              {appStatus === 'closed' && "Staff applications are now closed. Please check back later."}
            </span>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <section id="application-form" className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {appStatus === 'closed' ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Applications Closed</h3>
              <p className="text-slate-500">We are not accepting new applications at this time.</p>
            </div>
          ) : (
            <ApplicationForm />
          )}
        </div>
      </section>
    </div>
  );
}

function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Application Received!</h3>
        <p className="text-green-700">
          Thanks for your staff application! An executive team member or manager will review it shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Staff Application</h2>
        <p className="text-slate-500 mt-1">Please fill out all sections honestly and completely.</p>
      </div>

      {/* Section 1: Personal Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
          Personal Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input required name="fullName" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Phone Number</label>
            <input required name="phone" type="tel" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input required name="email" type="email" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Home Suburb</label>
            <select required name="suburb" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">Select Suburb</option>
              {SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Are you legally allowed to work in Australia?</label>
          <select required name="legalWork" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </section>

      {/* Section 2: Availability */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</span>
          Availability
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Available Days</label>
            <input required name="availabilityDays" placeholder="e.g. Mon-Fri" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Available Hours</label>
            <input required name="availabilityHours" placeholder="e.g. 9am - 5pm" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Available for Weekend Shifts?</label>
            <select required name="weekendShifts" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Start Date</label>
            <input required name="startDate" type="date" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </section>

      {/* Section 3: Cleaning Experience */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">3</span>
          Cleaning Experience
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Describe your previous cleaning experience</label>
            <textarea required name="experience" rows={3} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">What were your last 2 jobs?</label>
            <textarea required name="lastJobs" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">What specific cleaning tasks have you performed?</label>
            <textarea required name="tasks" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Experience with chemicals/equipment?</label>
            <textarea required name="equipment" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Are you comfortable following a detailed checklist?</label>
            <select required name="checklist" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section 4: Work Skills & Attitude */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">4</span>
          Work Skills & Attitude
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">How do you ensure high quality work?</label>
            <textarea required name="qualityWork" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">How do you handle feedback?</label>
            <textarea required name="feedback" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Do you prefer working independently or in a team?</label>
            <textarea required name="teamwork" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </section>

      {/* Section 5: Reliability */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">5</span>
          Reliability & Professionalism
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Have you ever been dismissed from a job? If yes, why?</label>
            <textarea required name="dismissals" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Why is respecting client property important?</label>
            <textarea required name="respect" rows={2} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Why are you a good fit for Reuben's Cleaning Service?</label>
            <textarea required name="whyFit" rows={3} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </section>

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}
