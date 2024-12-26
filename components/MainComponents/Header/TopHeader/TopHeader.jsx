// "use client";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import Link from "next/link";
// import { toast, Toaster } from "sonner";
// import AnimatedSymbol from "../../Sections/Loading/AnimatedSymbol";
// import { useState } from "react";

// const TopHeader = () => {
//   return (
//     <div className="relative p-8">
//       <div className="justify-between items-center flex ">
//         <div className="flex items-center gap-4">
//           <ListContacts />
//         </div>
//         <div className="flex items-end gap-4">
//           <ListButton />
//         </div>
//       </div>
//     </div>
//   );
// };

// export const ListButton = () => {
// const [isLoaded, setIsLoaded] = useState(false);

// if (isLoaded)
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#15213d]">
//       <AnimatedSymbol />
//     </div>
//   );

//   return (
//     <div className="flex gap-2 items-center">
//       <div className="flex gap-2">
//         <Toaster position="top-right" className="text-[20px] font-semibold" />
//         <Button
//           className="px-5 rounded-[10px] text-[16px]  text-white font-semibold bg-transparent border-[1px] hover:bg-transparent hover:text-white"
//           variant="outline"
//           onClick={() =>
//             toast("", {
//               description: (
//                 <div>
//                   <span style={{ fontSize: "17px", fontStyle: "semibold" }}>
//                     Le dépôt d&apos;annonces est strictement gratuit.
//                     <br />
//                     <br />
//                     Cependant, cette fonctionnalité ne sera disponible que
//                     prochainement.
//                     <br />
//                     <br />
//                     En attendant, Nous vous prions alors de bien vouloir vous
//                     abonner à notre newsletter et soyez les premiers avertis.
//                     <br />
//                     <br />
//                   </span>
//                   <div className="mt-2">
//                     <span
//                       className="text-[#15213d] text-[17px] hover:underline font-semibold cursor-pointer"
//                       onClick={() => toast.dismiss()}
//                     >
//                       Très bien, d&apos;accord
//                     </span>
//                   </div>
// //                 </div>
//               ),
//               duration: 30000,
//             })
//           }
//         >
//           Déposer une annonce
//         </Button>
//       </div>
//     </div>
//   );
// };

// export function ListContacts() {
//   const dataContacts = [
//     {
//       name: "Lilee",
//       url: "https://maps.app.goo.gl/cHCgfdiczhJN6CQW9",
//       img: "/icons/icons(1).svg",
//     },
//     {
//       name: "06.50.37.68.37",
//       url: "06.50.37.68.37",
//       img: "/icons/icons(8).svg",
//     },
//     {
//       name: "contact@lilee.fr",
//       url: "contact@lilee.fr",
//       img: "/icons/icons(7).svg",
//     },
//   ];
//   return (
//     <div className="items-center gap-10 flex">
//       {dataContacts.map((i, index) => (
//         <Link
//           key={index}
//           href={i.url}
//           className="inline-flex space-x-2 items-center"
//         >
//           <Image
//             src={i.img}
//             width={24}
//             height={24}
//             alt="img"
//             className="hover:scale-110 transition-transform duration-200"
//           />
//           <span className="text-[16px] text-white font-semibold visible max-md:hidden">
//             {i.name}
//           </span>
//         </Link>
//       ))}
//     </div>
//   );
// }

// export const ListIcons = () => {
//   const dataIcons = [
//     {
//       url: "https://www.facebook.com/lileelogementspmr?locale=fr_FR",
//       img: "/icons/icons(6).svg",
//       name: "Facebook",
//     },
//     {
//       url: "https://www.youtube.com/@lileepmr",
//       img: "/icons/icons(3).svg",
//       name: "YouTube",
//     },
//     {
//       url: "https://www.linkedin.com/company/86267153/admin/",
//       img: "/icons/icons(2).svg",
//       name: "LinkedIn",
//     },
//     {
//       url: "https://www.instagram.com/lilee.fr/",
//       img: "/icons/icons(4).svg",
//       name: "Instagram",
//     },
//   ];

//   return (
//     <div className="flex justify-center items-center gap-x-10">
//       {dataIcons.map((icon, index) => (
//         <div key={index} className="flex flex-col items-center ">
//           <Link href={icon.url} target="_blank" rel="noopener noreferrer">
//             <Image
//               src={icon.img}
//               width={32}
//               height={32}
//               alt={icon.name}
//               className="hover:scale-110 transition-transform duration-200"
//             />
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TopHeader;

"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { FaEllipsisV } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedSymbol from "../../Sections/Loading/AnimatedSymbol";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const TopHeader = () => {
  return (
    <div className="relative p-8">
      <div className="justify-between items-center flex ">
        <div className="flex items-center gap-4">
          <ListContacts />
        </div>
        <div className="flex items-end gap-4">
          <ListButton />
        </div>
      </div>
    </div>
  );
};

export const ListButton = () => {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#15213d]">
        <AnimatedSymbol />
      </div>
    );

  const handleSignOut = () => {
    signOut();
  };

  const getRolePath = () => {
    const role = session?.user?.role;
    if (role === "PERSO") return "/personnel/";
    if (role === "PRO") return "/professionel";
    if (role === "ADMIN") return "/admin";
    return "";
  };

  const rolePath = session ? getRolePath() : "";
  const profileUrl = `${rolePath}/profile/${session?.user?.id}`;
  const securityUrl = `${rolePath}/security/${session?.user?.id}`;
  const clientSpaceUrl = rolePath;

  if (status === "loading")
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">
            Chargement en cours...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex gap-2 items-center">
      {session ? (
        <DropdownMenu>
          <div className="flex items-center space-x-3 bg-dark rounded-full p-2">
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt="User profile"
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-orange-500 font-bold text-[16px]">
                {session.user.nom} {session.user.prenom}
              </span>
            </div>

            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-700">
                <FaEllipsisV className="text-gray-400" />
              </button>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent align="end" className="w-64 mt-2">
            <DropdownMenuLabel>
              <p className="text-orange-500 font-bold text-xl">
                {session.user.nom} {session.user.prenom}
              </p>
              <p className="text-gray-600 text-sm">{session.user.email}</p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href={profileUrl}>Votre profil</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href={securityUrl}>Sécurité</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href={clientSpaceUrl}>Espace utilisateur</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Button variant="outline" onClick={handleSignOut}>
                Se déconnecter
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Toaster position="top-right" className="text-base font-semibold" />
          <Button
            className="px-5 rounded-[10px] text-[16px] text-white font-semibold bg-transparent border-[1px] hover:bg-transparent hover:text-white"
            variant="outline"
            onClick={() =>
              toast("", {
                description: (
                  <div>
                    <span style={{ fontSize: "16px", fontStyle: "semibold" }}>
                      Le dépôt d&apos;annonces est strictement gratuit.
                      <br />
                      <br />
                      Cependant, cette fonctionnalité ne sera disponible que
                      prochainement.
                      <br />
                      <br />
                      En attendant, Nous vous prions alors de bien vouloir vous
                      abonner à notre newsletter et soyez les premiers avertis.
                      <br />
                      <br />
                    </span>
                    <div className="mt-2">
                      <span
                        className="text-[#15213d] text-base hover:underline font-semibold cursor-pointer"
                        onClick={() => toast.dismiss()}
                      >
                        Très bien, d&apos;accord
                      </span>
                    </div>
                  </div>
                ),
              })
            }
          >
            Déposer une annonce
          </Button>
          <Button
            asChild
            className="px-5 rounded-[10px] text-[16px] font-semibold bg-transparent border-[1px] hover:border"
          >
            <Link href={"/login"}>Se connecter</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export function ListContacts() {
  const dataContacts = [
    {
      name: "Lilee",
      url: "https://maps.app.goo.gl/cHCgfdiczhJN6CQW9",
      img: "/icons/icons(1).svg",
    },
    {
      name: "06.50.37.68.37",
      url: "06.50.37.68.37",
      img: "/icons/icons(8).svg",
    },
    {
      name: "contact@lilee.fr",
      url: "contact@lilee.fr",
      img: "/icons/icons(7).svg",
    },
  ];
  return (
    <div className="items-center gap-10 flex">
      {dataContacts.map((i, index) => (
        <Link
          key={index}
          href={i.url}
          className="inline-flex space-x-2 items-center"
        >
          <Image
            src={i.img}
            width={24}
            height={24}
            alt="img"
            className="hover:scale-110 transition-transform duration-200"
          />
          <span className="text-[16px] text-white font-semibold visible max-md:hidden">
            {i.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

export const ListIcons = () => {
  const dataIcons = [
    {
      url: "https://www.facebook.com/lileelogementspmr?locale=fr_FR",
      img: "/icons/icons(6).svg",
      name: "Facebook",
    },
    {
      url: "https://www.youtube.com/@lileepmr",
      img: "/icons/icons(3).svg",
      name: "YouTube",
    },
    {
      url: "https://www.linkedin.com/company/86267153/admin/",
      img: "/icons/icons(2).svg",
      name: "LinkedIn",
    },
    {
      url: "https://www.instagram.com/lilee.fr/",
      img: "/icons/icons(4).svg",
      name: "Instagram",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-x-10">
      {dataIcons.map((icon, index) => (
        <div key={index} className="flex flex-col items-center ">
          <Link href={icon.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={icon.img}
              width={32}
              height={32}
              alt={icon.name}
              className="hover:scale-110 transition-transform duration-200"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TopHeader;
