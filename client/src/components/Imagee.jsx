import { Image } from "@imagekit/react";

const Imagee = ({ src, className, w, h, alt }) => {
  return (
    <div>
      <Image
        className={className}
        urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
        src={src}
        loading="lazy"
        Laip={{ active: true, quality: 20 }}
        width={w}
        height={h}
        transformation={[
          {
            width: w,
            height: h,
          },
        ]}
        alt={alt}
      />
    </div>
  );
};

export default Imagee;
