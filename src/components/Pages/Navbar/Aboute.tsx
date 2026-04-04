import { Link } from "react-router-dom";
import FAQSection from "./Faque";

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-white px-4 py-16 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-black mb-6">
          About Pharmadoor
        </h1>
        <p className="text-center text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
          Pharmadoor is your trusted digital healthcare partner, delivering
          authentic medicines to your doorstep. With technology and trust, we
          ensure safe and timely delivery to every corner of the country.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Our Mission
            </h3>
            <p className="text-gray-600">
              To revolutionize healthcare delivery by making it fast,
              affordable, and accessible to everyone.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Our Vision
            </h3>
            <p className="text-gray-600">
              Empower every home with digital access to trusted pharmacy
              services and health solutions.
            </p>
          </div>

          {/* Values */}
          <div className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Our Promise
            </h3>
            <p className="text-gray-600">
              Genuine medicines, expert support, timely delivery, and a
              user-friendly experience—always.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/contact-page"
            className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-primary-dark transition"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-4">
          <FAQSection />
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
