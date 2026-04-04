import delevary from "../../../assets/delevary.png";
import seftyImage from "../../../assets/warning.png";
import pregnancyImage from "../../../assets/pregnancy1.png";
import { MdEditDocument } from "react-icons/md";
const SafetyAdvice = () => {
  return (
    <div>
      <div>
        <p className="p-2 bg-[#D8DADE] flex gap-3">
          {" "}
          <img className="w-6 h-6" src={delevary} alt="" /> 12-24 Hours
        </p>
        <p className="mt-4 font-bold ">Safety Advices</p>
      </div>
      <div className="flex flex-wrap  items-center mt-3 gap-2">
        <img className="w-14 h-14 gap-2" src={seftyImage} alt="" />
        <p className="text-[#B0B3B8]">
          It is unsafe to consume alcohol with Ecosprin 75.
        </p>
      </div>

      <div className="flex flex-wrap  items-center mt-3 gap-2">
        <img className="w-14 h-14 gap-2" src={pregnancyImage} alt="" />
        <p className="text-[#B0B3B8]">
          Ecosprin 75 is unsafe to use during pregnancy as there is definite{" "}
          <br />
          evidence of risk to the developing baby,However, the doctor <br />
          mayrarely
          prescribeitinsomelife-threateningsituationsifthebenefitsaremore <br />
          than the potential risks, Please consult your doctor.
        </p>
      </div>
      <div className="mt-4">
        <p className="flex gap-8 text-[#73AFAD] items-center">
          <MdEditDocument className="text-3xl" />
          Medicine Overview of Ecosprin 75mg Tablet
        </p>
      </div>
      <div>
        <p className="text-[#79B2B1] mt-2">Introduction</p>
        <p className="mt-4 text-[#A4A8AE]">
          Ecosprin 75 is an antiplatelet medicine used to treat and prevent{" "}
          <br />
          heart attacks, strokes and heart-related chest pain (angina),
          <br />
          symptoms. You should take It as recommended by your doctor. The <br />
          most common side effects of this medicine are heartburn or upset
          stomach....
        </p>
      </div>
    </div>
  );
};

export default SafetyAdvice;
