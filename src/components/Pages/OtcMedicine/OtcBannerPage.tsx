import { motion } from "framer-motion";
import OtcImage from "../../../assets/otcbanner.png";

const features = [
  {
    title: "On Call Doctor",
    description:
      "Our expert and cooperative doctors are available on call to provide you with fast and helpful advice.",
  },
  {
    title: "e-Diagnosis",
    description:
      "Osudpotro offers the best online diagnosis service with fast response, quick sample collection, digital reports, and free doctor consultation.",
  },
  {
    title: "Dedicated Call Center",
    description:
      "Our call center is operated by experienced teleconsultants available 24/7 to serve all customers efficiently.",
  },
];

const OtcBannerPage = () => {
  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      {/* OTC Banner Section */}
      <div
        className="flex flex-col md:flex-row items-center justify-center gap-6 rounded-lg p-6 bg-cover bg-center text-white"
        style={{
          backgroundImage: "url('https://i.ibb.co/d09Q7hwr/otcbacground.png')",
        }}
      >
        <img
          src={OtcImage}
          alt="OTC Banner"
          className="w-60 md:w-80 object-contain"
        />

        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">OTC Medicines</h1>
          <p className="text-sm sm:text-base leading-relaxed text-white/90">
            OTC medicine refers to the medicines that can be bought without a
            prescription. People use OTC products to treat common health issues
            like pain, colds, coughs, diarrhea, constipation, fever, and other
            minor ailments.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-violet-600 mb-3">
              {feature.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OtcBannerPage;
