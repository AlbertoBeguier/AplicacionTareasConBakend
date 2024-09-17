
import PropTypes from 'prop-types';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, folderName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-xl font-bold text-white mb-4">Confirmar eliminación</h3>
        <p className="text-gray-300 mb-6">
          ¿Está seguro de que desea eliminar la carpeta &quot;{folderName}&quot;? Esta acción es irreversible.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  folderName: PropTypes.string.isRequired,
};