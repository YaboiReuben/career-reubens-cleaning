import { ArrowRight, CheckCircle, Star, Shield, Clock, MapPin, Users, Heart, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731117-104f2a8d46a8?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Build Your Career with <br className="hidden md:block" />
            <span className="text-blue-300">Reuben’s Cleaning Service</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            We are looking for reliable, hardworking individuals to join our growing team. 
            Flexible hours, great pay, and a supportive work environment.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/careers"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#about"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors border border-blue-700"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section (Context for Applicants) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">The Work You'll Do</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Join a team that delivers excellence across a variety of cleaning environments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Residential Teams",
              desc: "Help families maintain beautiful homes. Tasks include general cleaning, deep cleans, and end-of-lease details.",
              icon: <Star className="w-6 h-6 text-blue-600" />
            },
            {
              title: "Commercial Crews",
              desc: "Maintain professional workspaces, offices, and retail locations. Often involves evening or weekend shifts.",
              icon: <Shield className="w-6 h-6 text-blue-600" />
            },
            {
              title: "Specialized Projects",
              desc: "Handle high-pressure cleaning, window washing, and carpet cleaning using professional-grade equipment.",
              icon: <CheckCircle className="w-6 h-6 text-blue-600" />
            }
          ].map((service, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us (Culture Focus) */}
      <section id="about" className="bg-slate-50 py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Join Reuben's Cleaning?</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  We aren't just a cleaning company; we're a team of professionals who take pride in our work. 
                  We value reliability, honesty, and a positive attitude above all else.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Supportive Team</h4>
                      <p className="text-sm">Work with managers who respect you and a team that has your back.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Training Provided</h4>
                      <p className="text-sm">No experience? No problem. We provide full training on equipment and chemicals.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Fair Pay & Flexibility</h4>
                      <p className="text-sm">Competitive rates and shifts that can fit around your lifestyle.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" 
                  alt="Team Meeting" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 hidden md:block max-w-xs">
                <div className="flex gap-1 text-yellow-400 mb-2">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <p className="text-sm font-medium text-slate-900">"Best place I've worked. The management actually cares about the staff."</p>
                <p className="text-xs text-slate-500 mt-2">— Sarah, Team Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Have Questions Before Applying?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Visit our support portal to contact our HR team or check application status.
            </p>
            <a 
              href="https://supportreubenscleaning.pages.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Contact Support
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
