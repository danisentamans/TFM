import { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '70px',
          zIndex: 1000,
          backgroundColor: '#e2a357',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px',
          cursor: 'pointer'
        }}
        onClick={toggleChatbot}
      >
        {isOpen ? 'Minimizar' : 'Chat'}
      </button>
      {isOpen && (
        <iframe
          style={{
            position: 'fixed',
            bottom: '50px',
            right: '70px',
            height: '400px',
            width: '300px',
            border: 'none',
            zIndex: 1000,
          }}
          src="https://widget.botsonic.com/CDN/index.html?service-base-url=https%3A%2F%2Fapi-azure.botsonic.ai&token=de546e7b-f45b-415c-8137-19ca6666caf2&base-origin=https%3A%2F%2Fbot.writesonic.com&instance-name=Botsonic&standalone=true&page-url=https%3A%2F%2Fbot.writesonic.com%2Fbots%2Faf8a68e9-0c56-42e7-8615-d522dcc0f20e%2Fconnect"
          title="Chatbot"
        ></iframe>
      )}
    </>
  );
};

export default Chatbot;
