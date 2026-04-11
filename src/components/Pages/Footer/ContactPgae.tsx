import { Input, Button } from "antd";

const ContactUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#005E6A] mb-6">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Input placeholder="Your Name" />
          <Input placeholder="Email" />
          <Input.TextArea rows={4} placeholder="Message" />
          <Button type="primary" className="bg-[#005E6A]">
            Send Message
          </Button>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl">
          <h2 className="font-semibold">Reach Us</h2>
          <p>📞 09610-001122</p>
          <p>📧 support@osudpotro.com</p>
          <p>📍 Bangladesh</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
