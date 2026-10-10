export async function preparePhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("photo_type");
  if (file.size > 20_000_000) throw new Error("photo_size");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const ratio = Math.min(
      1,
      1280 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * ratio);
    canvas.height = Math.round(image.naturalHeight * ratio);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("photo_invalid");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL("image/jpeg", 0.78);
    if (result.length > 1_300_000) throw new Error("photo_size");
    return result;
  } catch (error) {
    if (
      error instanceof Error &&
      ["photo_size", "photo_type"].includes(error.message)
    )
      throw error;
    throw new Error("photo_invalid");
  } finally {
    URL.revokeObjectURL(url);
  }
}
