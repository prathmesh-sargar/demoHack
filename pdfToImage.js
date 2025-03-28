import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url"; // Manually specify the worker

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker; // Set the worker path

export async function pdfToImage(pdfFile) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.readAsArrayBuffer(pdfFile);
    reader.onload = async function () {
      try {
        const pdfData = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const image = canvas.toDataURL("image/jpeg");
        resolve(image);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}
