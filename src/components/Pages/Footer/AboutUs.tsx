const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-[#005E6A] mb-4">
        About Osudpotro
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-gray-600 leading-relaxed">
            Osudpotro is a modern online pharmacy platform dedicated to
            providing genuine medicines at affordable prices. We ensure fast
            delivery, verified drugs, and trusted healthcare services across
            Bangladesh.
          </p>

          <ul className="mt-5 space-y-2 text-gray-700">
            <li>✔ 100% Genuine Medicines</li>
            <li>✔ Fast Home Delivery</li>
            <li>✔ Licensed Pharmacy System</li>
            <li>✔ 24/7 Customer Support</li>
          </ul>
        </div>

        <img
          src="https://i.ibb.co/heart.png"
          className="rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default AboutUs;
