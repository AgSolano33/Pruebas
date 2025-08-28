const HelpButton = ({ user }) => {
  // Generar mensaje con nombre y rol
  const message = encodeURIComponent(
    `Hola, soy ${user.name}. Te contacto para solicitar ayuda con un proceso`
  );

  return (
    <a
      href={`https://wa.me/525533600625?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white text-2xl p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      title="Ayuda por WhatsApp"
    >
      💬
    </a>
  );
};

export default HelpButton;
