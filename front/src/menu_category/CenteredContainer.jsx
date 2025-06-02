// components/CenteredContainer.jsx
function CenteredContainer({ children }) {
  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2vw',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

export default CenteredContainer;
