import bcrypt from "bcrypt";
import User from "../models/user";
import connectMongo from "../services/mongodb";

export const criarAdmin = async () => {
  await connectMongo();

  const adminEmail = "admin@admin.com";
  const adminExiste = await User.findOne({ email: adminEmail });

  if (!adminExiste) {
    const senhaCriptografada = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      email: adminEmail,
      password: senhaCriptografada,
      role: "ADMIN",
    });

    await admin.save();
    console.log("Usuário Admin criado com Sucesso");
  } else {
    console.log("Usuário Admin já Existe");
  }
};

criarAdmin().catch(console.error);
