import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";

import { Modal } from "./Modal";
import { fetchAPI } from "./fetcher.js";

export const BarcodeScanner: Component = () => {
  const BarcodeDetectorAPIavailable = "BarcodeDetector" in window;

  const [iScanning, setIsScanning] = createSignal(false);

  const onDetection = async (barcode) => {
    fetchAPI(barcode);
    setIsScanning(false);
  };

  return (
    <Show when={true}>
      <button
        class="fixed bottom-10 right-5 w-10 h-10 z-60 grid place-items-center bg-green-500 rounded-full focus:outline-none hover:bg-green-500"
        classList={{ "bg-rose-500 hover:bg-rose-600": iScanning() }}
        style="z-index:60"
        onclick={() => setIsScanning((prev) => !prev)}
        title="Scan button"
        aria-label="auto"
        aria-live="polite"
      >
        <img
          class="object-cover p-3"
          src={iScanning() ? "./assets/scan_cancel.svg" : "./assets/scan.svg"}
          alt=""
        />
      </button>
      <Show when={iScanning()}>
        <Modal>
          <VideoScanner onDetection={onDetection} />
        </Modal>
      </Show>
    </Show>
  );
};

const VideoScanner: Component = (props) => {
  let videoEl, intervalId;

  onMount(() => {
    getStreamVideo();
    getCodeBar();
  });

  onCleanup(() => window.clearInterval(intervalId));
  onCleanup(() =>
    videoEl.srcObject.getTracks().forEach((track) => track.stop())
  );

  const getStreamVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: { ideal: "environment" },
      },
    });
    videoEl.srcObject = stream;
    await videoEl.play();
  };

  const getCodeBar = () => {
    if (!("BarcodeDetector" in window)) return;

    const barcodeDetector = new BarcodeDetector([
      "code_39",
      "codabar",
      "ean_13",
      "ean_14",
    ]);
    intervalId = window.setInterval(async () => {
      const barcodes = await barcodeDetector.detect(videoEl);
      if (barcodes.length <= 0) return;
      let barcode = barcodes[0]["rawValue"];
      props.onDetection(barcode);
    }, 1000);
  };

  return <video class="w-full h-full object-cover" ref={videoEl} autoplay />;
};

export const BarcodeScannerFallBack: Component = () => (
  <main class="<grid place-items-center">
    <section class="flex flex-col m-8 text-lg font-extrabold text-slate-900 tracking-tight dark:text-slate-200 text-center">
      <span>This app only works on phone</span>
      <span>Scan this QR code</span>
      <img
        class="my-4 mx-auto w-52 aspect-square"
        src="./assets/qr_url.svg"
        alt="qr code"
      ></img>
      <span>or go to this url</span>
      <span>https://mtt-artis.github.io/food-comparator/</span>
    </section>
  </main>
);
