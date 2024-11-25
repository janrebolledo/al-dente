export function motionProps(i) {
  const motionProps = {
    initial: { opacity: 0, translateY: 50 },
    whileInView: { opacity: 1, translateY: 0 },
    transition: { ease: 'circOut', delay: i * 0.15, duration: 0.3 },
  };

  return motionProps;
}
