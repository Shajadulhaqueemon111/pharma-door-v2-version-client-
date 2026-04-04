import OfferSection from "../OfferSection/OfferSection";
import ImageUploder from "./ImageUploder";
import { motion } from "framer-motion";

const BannerCard = () => {
  return (
    <div>
      <div className="mt-6 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent px-2 py-1 rounded-md">
            PharmaDoor: The Leading Online Pharmacy and Healthcare Platform of
            Bangladesh.
          </h1>
        </motion.div>
      </div>

      <div>
        <ImageUploder />
      </div>
      <div>
        <OfferSection></OfferSection>
      </div>
    </div>
  );
};

export default BannerCard;
