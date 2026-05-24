import { useTranslation } from "react-i18next";
import { predictBird } from "../api/birdApi";
import {
  useState,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiUploadCloud,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

export default function Upload() {

  const { t, i18n } = useTranslation();

  const [preview, setPreview] = useState<string | null>(null);

  const [result, setResult] = useState<any>(null);

  const [showInfo, setShowInfo] = useState(false);

  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // HANDLE FILE
  const handleFile = async (file: File) => {

    const url = URL.createObjectURL(file);

    setPreview(url);

    setResult(null);

    setShowInfo(false);

    setLoading(true);

    try {

      const data = await predictBird(file);

      await new Promise((resolve) =>
        setTimeout(resolve, 2500)
      );

      console.log("FINAL DATA:", data);

      setResult({
        prediction: data.prediction || "Unknown Bird",
        confidence: data.confidence || 0,
        info: data.info,
      });

      setLoading(false);

    } catch (error) {

      console.error(error);

      setLoading(false);

      setResult({
        prediction: "Prediction Failed",
        confidence: 0,
        info: {},
      });

    }

  };

  // FILE SELECT
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {

    const f = e.target.files?.[0];

    if (f) handleFile(f);

  };

  // DRAG DROP
  const onDrop = (e: DragEvent<HTMLDivElement>) => {

    e.preventDefault();

    const f = e.dataTransfer.files?.[0];

    if (f) handleFile(f);

  };

  // RESET
  const reset = () => {

    setPreview(null);

    setResult(null);

    setShowInfo(false);

    if (inputRef.current) {

      inputRef.current.value = "";

    }

  };

  return (

    <section
  id="upload"
  className="relative overflow-hidden px-4 py-20 min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100"
> 
{/* BACKGROUND BLURS */}

<div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-green-300/30 blur-3xl" />

<div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
    

      <div className="mx-auto max-w-7xl">

        {/* LANGUAGE BUTTONS */}
        <div className="flex gap-3 justify-center mb-10">

          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            English
          </button>

          <button
            onClick={() => i18n.changeLanguage("gu")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            ગુજરાતી
          </button>

          <button
            onClick={() => i18n.changeLanguage("hi")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            हिन्दी
          </button>

        </div>

        {/* HEADING */}
        <div className="mx-auto max-w-3xl text-center">

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-500 to-green-700 bg-clip-text text-transparent"
          >
            {t("upload")}
          </motion.h2>

          <p className="mt-5 text-lg text-gray-600">
            Drop an image and our AI will instantly identify Gujarat bird species.
          </p>

        </div>

        {/* MAIN GRID */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* UPLOAD BOX */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="relative rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-xl p-7 shadow-2xl min-h-[500px] flex items-center justify-center"
          >

            {!preview ? (

              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center">

                <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl">

                  <FiUploadCloud className="h-14 w-14" />

                </div>

                <h3 className="mt-8 text-3xl font-bold text-gray-800">
                  Drag & Drop Bird Image
                </h3>

                <p className="mt-3 text-gray-500 text-lg">
                  PNG / JPG supported
                </p>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={onChange}
                  className="hidden"
                />

              </label>

            ) : (

              <div className="relative w-full">

                <img
                  src={preview}
                  alt="uploaded bird"
                  className="w-full h-[450px] object-cover rounded-[28px]"
                />

                <button
                  onClick={reset}
                  className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                >
                  <FiX className="text-xl" />
                </button>

              </div>

            )}

          </motion.div>

          {/* RESULT */}
          <AnimatePresence>

            {loading ? (

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-xl p-10 shadow-2xl flex flex-col items-center justify-center min-h-[500px]"
              >

                <div className="h-24 w-24 border-[6px] border-green-500 border-t-transparent rounded-full animate-spin" />

                <h3 className="mt-8 text-3xl font-extrabold text-gray-800">
                  {t("analyzing")}
                </h3>

                <p className="mt-4 text-gray-500 text-lg text-center">
                  {t("identifying")}
                </p>

              </motion.div>

            ) : result ? (

              <motion.div
                key="result"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-[32px] overflow-hidden border border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl"
              >

                {/* TOP */}
                <div className="relative">

                  <img
                    src={preview!}
                    alt="bird"
                    className="h-[320px] w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-6 left-6">

                    <div className="flex items-center gap-2 text-white">

                      <FiCheckCircle />

                      <span className="uppercase text-xs tracking-widest font-bold">
                        {t("detection")}
                      </span>

                    </div>

                    <h2 className="mt-3 text-4xl font-extrabold text-white">
                      {result.prediction}
                    </h2>

                    <p className="text-white/80 italic mt-2">
                      {result.info?.Category}
                    </p>

                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-7">

                  {/* ACCURACY */}
                  <div>

                    <div className="flex justify-between items-center">

                      <span className="text-gray-700 font-semibold text-lg">
                        {t("accuracy")}
                      </span>

                      <span className="text-3xl font-extrabold text-green-600">
                        {result.confidence}%
                      </span>

                    </div>

                    <div className="mt-4 h-4 w-full rounded-full bg-gray-200 overflow-hidden">

                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${result.confidence}%`,
                        }}
                        transition={{ duration: 1.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-600"
                      />

                    </div>

                  </div>

                  {/* RARE ALERT */}
                  {result.info?.is_rare === "Yes" && (

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-7 rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-6"
                    >

                      <h3 className="text-red-700 font-extrabold text-2xl">
                        ⚠ {t("rareAlert")}
                      </h3>

                      <p className="mt-3 text-red-600">
                        {t("rareMessage")}
                      </p>

                    </motion.div>

                  )}

                  {result.info?.special_feature && (

  <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-200 p-4">

    <h3 className="font-bold text-blue-700">
      ⭐ Special Feature
    </h3>

    <p className="mt-1 text-sm text-blue-600">
      {result.info.special_feature}
    </p>

  </div>

)}

                  {/* BUTTON */}
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="mt-8 w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-4 text-white font-bold text-lg shadow-lg hover:scale-[1.02] hover:shadow-2xl transition duration-300"
                  >

                    {showInfo
                      ? t("hideInfo")
                      : t("showInfo")}

                  </button>

                  {/* INFO */}
                  <AnimatePresence>

                    {showInfo && result.info && (

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5"
                      >

                        {Object.entries(result.info).map(([key, value]) => (

                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group rounded-3xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                          >

                            <div className="text-[11px] tracking-[3px] font-bold uppercase text-green-600">

                              {String(key).replaceAll("_", " ")}

                            </div>

                            <div className="mt-3 text-[16px] leading-relaxed text-gray-800 font-semibold">

                              {String(value)}

                            </div>

                          </motion.div>

                        ))}

                      </motion.div>

                    )}

                  </AnimatePresence>

                </div>

              </motion.div>

            ) : (

              <div className="rounded-[32px] border border-dashed border-green-300 bg-white/60 backdrop-blur-xl p-10 shadow-xl flex flex-col items-center justify-center min-h-[500px]">

                <div className="h-28 w-28 rounded-full bg-green-100 flex items-center justify-center">

                  <FiUploadCloud className="text-6xl text-green-600" />

                </div>

                <h3 className="mt-8 text-3xl font-bold text-gray-800">
                  Upload Bird Image
                </h3>

                <p className="mt-4 text-gray-500 text-center max-w-sm text-lg">
                  Upload a bird image and AI will identify species,
                  habitat, conservation status and more.
                </p>

              </div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </section>

  );

}