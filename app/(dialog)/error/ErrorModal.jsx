import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ErrorModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-800 rounded-full mx-auto flex items-center justify-center"
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </motion.div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Oups, erreur
              </h2>
              <p className="mt-2 text-gray-600">
                Désolé, une erreur s&apos;est produite. Veuillez réessayer.
              </p>
              <Button
                onClick={onClose}
                className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-800 hover:from-red-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                Fermer
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}