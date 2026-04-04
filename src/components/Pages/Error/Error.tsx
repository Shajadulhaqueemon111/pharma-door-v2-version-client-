import { Link } from "react-router-dom";
// import ErrImage from "../../../assets/error1.webp";
const ErrorPage = () => {
  return (
    <div>
      <div>
        <img
          className="mx-auto w-3/5 "
          src="https://i.ibb.co/R404fKzJ/original-66bed19281474c1d825b5504209a036a-1.gif"
          alt="image"
        />
      </div>
      <div className="mx-auto text-center">
        <Link to="/">
          <button className="btn btn-secondary ">GO-TO-HOME-PAGE</button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
