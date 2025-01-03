import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const partenaire = await db.engagement.findUnique({
      where: { id: parseInt(id) },
      include: {
        contenuPartenaire: true,
        logo: true,
      },
    });

    if (!partenaire) {
      return new NextResponse(
        JSON.stringify({ message: "partenaire non trouvé" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(partenaire), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du partenaire :", error);
    return new NextResponse(
      JSON.stringify({ message: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse(JSON.stringify({ message: "ID manquant" }), {
        status: 400,
      });
    }

    const engagementId = parseInt(id, 10);

    const existingPartenaire = await db.engagement.findUnique({
      where: { id: engagementId },
    });

    if (!existingPartenaire) {
      return new NextResponse(
        JSON.stringify({ message: "Partenaire non trouvé" }),
        { status: 404 }
      );
    }

    const relatedImages = await db.contenuPartenaire.findMany({
      where: { engagementId },
    });

    for (const image of relatedImages) {
      const publicId = image.path.split("/").pop().split(".")[0];
      await fetch(`https://api.cloudinary.com/v1_1/dtryutlkz/image/destroy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: publicId,
          upload_preset: "ko4bjtic",
        }),
      });
    }

    await db.contenuPartenaire.deleteMany({
      where: { engagementId },
    });

    const existingLogo = await db.logo.findFirst({
      where: { engagementId },
    });

    if (existingLogo) {
      const publicId = existingLogo.path.split("/").pop().split(".")[0];
      await fetch(`https://api.cloudinary.com/v1_1/dtryutlkz/image/destroy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: publicId,
          upload_preset: "ko4bjtic",
        }),
      });

      await db.logo.delete({
        where: { id: existingLogo.id },
      });
    }

    await db.engagement.delete({
      where: { id: engagementId },
    });

    return new NextResponse(
      JSON.stringify({ message: "Partenaire supprimé avec succès!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du partenaire:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.formData();

    if (!id) {
      return new NextResponse(JSON.stringify({ message: "ID manquant" }), {
        status: 400,
      });
    }

    const nom = body.get("nomMarque");
    const email = body.get("emailMarque");
    const phone = body.get("phoneMarque");
    const adresse = body.get("adresseMarque");
    const siteWeb = body.get("siteWeb");
    const contenuPartenaire = body.getAll("contenuPartenaire");
    const logo = body.get("logo");
    const duree = body.get("duree");
    const description = body.get("description");
    const facebook = body.get("facebook");
    const instagram = body.get("instagramm");
    const twitter = body.get("twitter");
    const tikTok = body.get("tikTok");
    const linkedin = body.get("linkedIn");
    const youtube = body.get("youtube");
    const statutPartenaire = body.get("statutPartenaire");

    if (!nom || !email || !phone || !adresse || !logo || !duree) {
      return new NextResponse(
        JSON.stringify({
          message: "Tous les champs requis doivent être remplis.",
        }),
        { status: 400 }
      );
    }

    const updatedPartenaire = await db.engagement.update({
      where: { id: parseInt(id, 10) },
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

    if (contenuPartenaire.length > 0) {
      await db.contenuPartenaire.deleteMany({
        where: { engagementId: updatedPartenaire.id },
      });

      for (const file of contenuPartenaire) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ko4bjtic");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dtryutlkz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.secure_url) {
          throw new Error("Échec du téléchargement de l'image");
        }

        const imageUrl = uploadResult.secure_url;

        await db.contenuPartenaire.create({
          data: {
            path: imageUrl,
            engagementId: updatedPartenaire.id,
          },
        });
      }
    }

    if (logo) {
      const existingLogo = await db.logo.findFirst({
        where: { engagementId: updatedPartenaire.id },
      });

      if (existingLogo) {
        await db.logo.delete({
          where: { id: existingLogo.id },
        });
      }

      const logoFormData = new FormData();
      logoFormData.append("file", logo);
      logoFormData.append("upload_preset", "ko4bjtic");

      const logoUploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dtryutlkz/image/upload",
        {
          method: "POST",
          body: logoFormData,
        }
      );

      const logoUploadResult = await logoUploadResponse.json();
      const logoUrl = logoUploadResult.secure_url;

      if (!logoUploadResponse.ok || !logoUrl) {
        throw new Error("Échec du téléchargement du logo.");
      }

      await db.logo.create({
        data: {
          path: logoUrl,
          engagementId: updatedPartenaire.id,
        },
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Article mis à jour avec succès!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Erreur lors de la mise à jour de l'article" }),
      { status: 500 }
    );
  }
}
