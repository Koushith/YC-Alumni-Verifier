const Gift = (props: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <img
        src="https://www.ycombinator.com/packs/static/ycdc/ycombinator-logo-ee6c80faf1d1ce2491d8.png"
        alt="yc-logo"
        width={50}
      />
    </div>
  );
};
export default Gift;
