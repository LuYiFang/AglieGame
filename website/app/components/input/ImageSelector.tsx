import { FC, useEffect, useRef, useState } from "react";

const ImageSelector: FC<{
  defaultImg: string;
  imgProps?: { [key: string]: any };
  open: boolean;
  onClose: (...args: any) => void;
  onSave: (...args: any) => void;
  tagType?: string;
}> = ({ defaultImg, imgProps, open, onClose, onSave, tagType = "html" }) => {
  const [img, setImg] = useState<string>(defaultImg);
  const uploadRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!open) return;

    openFileSelector();
  }, [open]);

  const openFileSelector = () => {
    if (!uploadRef.current) return;
    uploadRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onClose();
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    setImg(fileUrl);
    onSave(fileUrl);
  };

  return (
    <>
      {tagType === "html" ? (
        <img
          src={img}
          {...(imgProps || {})}
          style={{
            userSelect: "none",
            ...(imgProps?.style || {}),
          }}
        />
      ) : (
        <image
          href={img}
          {...(imgProps || {})}
          style={{
            userSelect: "none",
            ...(imgProps?.style || {}),
          }}
        />
      )}
      {tagType === "html" ? (
        <input
          type="file"
          accept="image/*"
          ref={uploadRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      ) : (
        <foreignObject>
          <input
            type="file"
            accept="image/*"
            ref={uploadRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </foreignObject>
      )}
    </>
  );
};
export default ImageSelector;
