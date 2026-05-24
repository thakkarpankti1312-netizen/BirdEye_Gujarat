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
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // HANDLE FILE
  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file);

    setPreview(url);
    setResult(null);
    setShowInfo(false);

    try {
      const data = await predictBird(file);

      console.log("FINAL DATA:", data);
      console.log("INFO KEYS:", Object.keys(data.info || {}));

      setResult({
        prediction: data.prediction || "Unknown Bird",
        confidence: data.confidence || 0,
        info: data.info,
      });
    } catch (error) {
      console.error(error);

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
    <section id="upload" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Upload a <span className="gradient-text">bird photo</span>
          </h2>

          <p className="mt-4 text-muted-foreground">
            Drop an image and our AI will identify the species in seconds.
          </p>

        </div>

        {/* Main Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Upload Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="relative rounded-3xl glass p-6 shadow-soft min-h-[360px] flex items-center justify-center"
          >

            {!preview ? (
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center">

                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-green-500 text-white">
                  <FiUploadCloud className="h-8 w-8" />
                </div>

                <p className="mt-4 font-semibold">
                  Drag & drop your bird image
                </p>

                <p className="text-sm text-muted-foreground">
                  or click to browse — PNG / JPG
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
                  key={preview}
                  src={preview}
                  alt="uploaded bird"
                  className="w-full h-80 object-cover rounded-2xl"
                />

                <button
                  onClick={reset}
                  className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white"
                >
                  <FiX />
                </button>

              </div>
            )}

          </div>

          {/* RESULT */}
          <AnimatePresence>

            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl glass p-7 shadow-elegant"
              >

                <div className="flex items-center gap-2 text-primary">

                  <FiCheckCircle />

                  <span className="text-xs font-semibold uppercase">
                    Detection Complete
                  </span>

                </div>

                {/* Bird Name */}
                <h3 className="mt-3 text-3xl font-extrabold">
                  {result.prediction}
                </h3>

                {/* Category */}
                <p className="text-sm italic text-muted-foreground">
                  {result.info?.Category}
                </p>

                {/* Accuracy */}
                <div className="mt-5">

                  <div className="flex justify-between text-sm font-medium">

                    <span>Accuracy</span>

                    <span className="gradient-text font-bold">
                      {result.confidence}%
                    </span>

                  </div>

                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${result.confidence}%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-full bg-green-500"
                    />

                  </div>

                </div>

                {/* BUTTON */}
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="mt-6 w-full rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition"
                >
                  {showInfo
                    ? "Hide Bird Information"
                    : "Show Bird Information"}
                </button>

                {/* CSV INFO */}
                {showInfo && result.info && (
                  <div className="mt-6 grid grid-cols-1 gap-3">

                    {Object.keys(result.info).map((key) => (

                      <div
                        key={key}
                        className="rounded-xl bg-secondary/60 p-4"
                      >

                        <div className="text-xs font-bold uppercase text-green-700">
                          {String(key)}
                        </div>

                        <div className="mt-1 text-sm text-black">
                          {String(result.info[key])}
                        </div>

                      </div>

                    ))}

                  </div>
                )}

              </motion.div>
            ) : (

              <div className="rounded-3xl glass p-7 shadow-elegant flex items-center justify-center text-muted-foreground">
                Upload an image to see prediction result
              </div>

            )}

          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}