import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.formData();

    const nom = body.get("nomMarque");
    const email = body.get("emailMarque");
    const phone = body.get("phoneMarque");
    const adresse = body.get("adresseMarque");
    const siteWeb = body.get("siteWeb");
    const contenuPartenaire = body.getAll("contenuPub");
    const logo = body.get("logo");
    const duree = body.get("duree");
    const description = body.get("description");
    const facebook = body.get("facebook");
    const instagram = body.get("instagram");
    const twitter = body.get("twitter");
    const tikTok = body.get("tikTok");
    const linkedin = body.get("linkedIn");
    const youtube = body.get("youtube");
    const statutPartenaire = body.get("statutPartenaire") || "ACTIF";

    if (!nom || !email || !phone || !adresse || !logo || !duree) {
      return NextResponse.json(
        { message: "Tous les champs requis doivent être remplis." },
        { status: 400 }
      );
    }

    const uploadImage = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ko4bjtic");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtryutlkz/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Échec de l'upload de l'image.");
      }

      const result = await response.json();
      return result.secure_url;
    };

    const imageUrls = await Promise.all(
      contenuPartenaire.map((image) => uploadImage(image))
    );

    const logoUrl = await uploadImage(logo);

    const newPartenaire = await db.engagement.create({
      data: {
        nom,
        email,
        siteWeb,
        phone,
        adresse,
        facebook,
        instagram,
        twitter,
        tikTok,
        linkedin,
        youtube,
        duree,
        description,
        statutPartenaire,
      },
    });

    const engagementId = newPartenaire.id;

    // Insertion des contenus partenaires et du logo
    const imageInsertions = imageUrls.map((imageUrl) =>
      db.contenuPartenaire.create({
        data: { path: imageUrl, engagementId },
      })
    );

    await Promise.all([
      ...imageInsertions,
      db.logo.create({ data: { path: logoUrl, engagementId } }),
    ]);

    return NextResponse.json(
      {
        message: "Partenaire et images créés avec succès.",
        partenaire: newPartenaire,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du partenaire :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const partenaires = await db.engagement.findMany({
      include: { contenuPartenaire: true, logo: true },
      orderBy: { createdAt: "desc" },
    });

    const formattedPartenaires = partenaires.map((partenaire) => ({
      ...partenaire,
      logoUrl: partenaire.logo[0]?.path || null,
      contenuUrls: partenaire.contenuPartenaire.map((contenu) => contenu.path),
    }));

    return new NextResponse(JSON.stringify(formattedPartenaires), {
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des partenaires :", error);
    return new NextResponse(
      JSON.stringify({ message: "Erreur interne du serveur." }),
      { status: 500 }
    );
  }
}
