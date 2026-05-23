import { predictBird } from "../api/birdApi";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi";

export default function Upload() {

  const [preview, setPreview] = useState<string | null>(null);

  const [result, setResult] = useState<any>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // HANDLE FILE + AI PREDICTION
  // ==========================================
  const handleFile = async (file: File) => {

    const url = URL.createObjectURL(file);

    setPreview(url);

    try {

      const response = await predictBird(file);

      console.log(response);

      setResult(response);

    } catch (error) {

      console.error("Prediction Error:", error);

      alert("Prediction Failed");
    }
  };

  // ==========================================
  // FILE SELECT
  // ==========================================
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {

    const f = e.target.files?.[0];

    if (f) handleFile(f);
  };

  // ==========================================
  // DRAG & DROP
  // ==========================================
  const onDrop = (e: DragEvent<HTMLDivElement>) => {

    e.preventDefault();

    const f = e.dataTransfer.files?.[0];

    if (f) handleFile(f);
  };

  // ==========================================
  // RESET
  // ==========================================
  const reset = () => {

    setPreview(null);

    setResult(null);

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
            className="relative rounded-3xl glass p-6 shadow-soft min-h-90 flex items-center justify-center"
          >

            {!preview ? (

              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center">

                <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-glow animate-float">

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

                <span className="mt-6 rounded-full gradient-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-soft">

                  Choose Image

                </span>

              </label>

            ) : (

              <div className="relative w-full">

                <img
                  src={preview}
                  alt="uploaded bird"
                  className="w-full h-80 object-cover rounded-2xl"
                />

                <button
                  onClick={reset}
                  className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
                >

                  <FiX />

                </button>

              </div>
            )}
          </div>

          {/* Result Section */}
          <AnimatePresence mode="wait">

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

                  <span className="text-xs font-semibold uppercase tracking-wider">

                    Detection Complete

                  </span>

                </div>

                {/* Bird Name */}
                <h3 className="mt-3 text-2xl font-extrabold">

                  {result.prediction}

                </h3>

                {/* Scientific Name */}
                <p className="text-sm italic text-muted-foreground">

                  {result.Scientific_Name}

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
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1 }}
                      className="h-full gradient-primary"
                    />

                  </div>

                </div>

                {/* Bird Details */}
                <dl className="mt-6 space-y-3 text-sm">

                  <Info
                    label="Habitat"
                    value={result.Habitat}
                  />

                  <Info
                    label="Diet"
                    value={result.Diet}
                  />

                  <Info
                    label="Conservation"
                    value={result.Conservation_status}
                  />

                  <Info
                    label="Category"
                    value={result.Category}
                  />

                  <Info
                    label="Family"
                    value={result.Family}
                  />

                </dl>

              </motion.div>

            ) : (

              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border-2 border-dashed border-border p-7 flex items-center justify-center text-center text-muted-foreground"
              >

                <p>

                  Prediction results will appear here once you upload an image.

                </p>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </section>
  );
}

// ==========================================
// INFO COMPONENT
// ==========================================
function Info({

  label,
  value

}: {

  label: string;
  value: string;

}) {

  return (

    <div className="rounded-xl bg-secondary/60 p-3">

      <dt className="text-xs font-semibold uppercase tracking-wider text-primary">

        {label}

      </dt>

      <dd className="mt-1 text-foreground">

        {value}

      </dd>

    </div>
  );
}