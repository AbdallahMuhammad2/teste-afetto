interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export default function ImageFallback({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  style,
  ...props
}: ImageProps) {
  // Se fill for verdadeiro, cria uma classe para posicionamento absoluto
  const fillClass = fill ? 'absolute inset-0 w-full h-full object-cover' : '';
  
  // Estilo para quando não for fill
  const sizeStyle = !fill && width && height ? { width, height } : {};
  
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${fillClass}`}
      style={{ ...sizeStyle, ...style }}
      {...props}
    />
  );
}