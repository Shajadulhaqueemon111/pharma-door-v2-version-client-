import { PhoneCall, Mail, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-10 text-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Contact Customer Care
        </h1>
        <p className="text-gray-600 text-lg">
          We’re here to help. Reach out to us anytime!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <PhoneCall className="text-blue-600 w-10 h-10 mb-2" />
            <h2 className="text-xl font-semibold">Call Us</h2>
            <p className="text-gray-700 mt-1">+880 1234 567 890</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <Mail className="text-blue-600 w-10 h-10 mb-2" />
            <h2 className="text-xl font-semibold">Email Us</h2>
            <p className="text-gray-700 mt-1">support@pharmadoor.com</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <MapPin className="text-blue-600 w-8 h-8 mb-2" />
          <p className="text-gray-600">
            PharmaDoor HQ, Khagan, Savar, Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
