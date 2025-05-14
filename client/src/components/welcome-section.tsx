import { Card } from "@/components/ui/card";

export default function WelcomeSection() {
  return (
    <section className="py-6 mb-4">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark mb-2">Your Medical Assistant</h1>
          <p className="text-neutral-dark mb-4">
            Ask any medical question and receive professional guidance. Available in multiple languages including Hinglish.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-secondary-light text-primary-dark px-3 py-1 rounded-full">Medical Advice</span>
            <span className="bg-secondary-light text-primary-dark px-3 py-1 rounded-full">Symptom Checker</span>
            <span className="bg-secondary-light text-primary-dark px-3 py-1 rounded-full">Medication Info</span>
            <span className="bg-secondary-light text-primary-dark px-3 py-1 rounded-full">Health Tips</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* A female doctor in a white coat with a stethoscope looking at camera */}
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Female doctor with stethoscope" 
            className="rounded-lg shadow-md object-cover h-32 w-full"
          />
          {/* A male doctor in scrubs looking at a tablet */}
          <img 
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Male doctor using tablet" 
            className="rounded-lg shadow-md object-cover h-32 w-full"
          />
          {/* A telehealth consultation with patient and doctor on screen */}
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Telehealth consultation" 
            className="rounded-lg shadow-md object-cover h-32 w-full"
          />
          {/* A healthcare professional examining medical charts */}
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Healthcare professional with medical charts" 
            className="rounded-lg shadow-md object-cover h-32 w-full"
          />
        </div>
      </div>
    </section>
  );
}
