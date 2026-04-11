const Blogs = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#005E6A] mb-6">Blogs</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="shadow-lg rounded-xl p-4">
            <h2 className="font-semibold">Health Tips {item}</h2>
            <p className="text-sm text-gray-500">
              Latest medical tips and updates...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
