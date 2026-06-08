import { useState } from 'react';

// ESTRUCTURAS DE DATOS DE LA SOLICITUD
interface Convocatoria {
  id: number;
  nombre: string;
  tipo: string;
  promedioMinimo: number;
}

interface SolicitudFormData {
  grado: string;
  promedio: string;
  curp: string;
  edad: string;
  direccion: string;
  localidad: string;
  cp: string;
  telefono: string;
  correo: string;
  motivo: string;
}

interface SolicitudFormProps {
  convocatoria: Convocatoria;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// COMPONENTE PRINCIPAL (FORMULARIO DE SOLICITUD DE BECA)
export const SolicitudForm = ({ convocatoria, onSubmit, onCancel, loading }: SolicitudFormProps) => {
  // ESTADOS DE DATOS Y ERRORES
  const [formData, setFormData] = useState<SolicitudFormData>({
    grado: '',
    promedio: '',
    curp: '',
    edad: '',
    direccion: '',
    localidad: '',
    cp: '',
    telefono: '',
    correo: '',
    motivo: '',
  });

  const [cardexFile, setCardexFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  // REGLAS Y CONDICIONES DE VALIDACIÓN
  const promedioVal = parseFloat(formData.promedio);
  const isPromedioInvalid = formData.promedio !== '' && (
    isNaN(promedioVal) || promedioVal < 6 || promedioVal > 10 || promedioVal < convocatoria.promedioMinimo
  );
  
  const edadVal = parseInt(formData.edad);
  const isEdadInvalid = formData.edad !== '' && (isNaN(edadVal) || edadVal < 16);

  const errors = {
    grado: submitted && !formData.grado ? 'El grado o semestre es obligatorio.' : '',
    promedio: submitted && !formData.promedio 
      ? 'El promedio es obligatorio.' 
      : isPromedioInvalid 
      ? `El promedio debe ser de al menos ${convocatoria.promedioMinimo} y no mayor a 10.` 
      : '',
    curp: submitted && !formData.curp.trim() ? 'La CURP es obligatoria.' : '',
    edad: submitted && !formData.edad 
      ? 'La edad es obligatoria.' 
      : isEdadInvalid 
      ? 'La edad mínima para postularse es 16 años.' 
      : '',
    direccion: submitted && !formData.direccion.trim() ? 'La dirección es obligatoria.' : '',
    localidad: submitted && !formData.localidad.trim() ? 'La localidad es obligatoria.' : '',
    cp: submitted && !formData.cp.trim() ? 'El código postal es obligatorio.' : '',
    telefono: submitted && !formData.telefono.trim() ? 'El teléfono es obligatorio.' : '',
    correo: submitted && !formData.correo.trim() ? 'El correo electrónico es obligatorio.' : '',
    motivo: submitted && !formData.motivo.trim() ? 'El motivo de la solicitud es obligatorio.' : '',
    cardexFile: (submitted && !cardexFile) || fileError ? 'El cárdex en formato PDF es obligatorio.' : '',
  };

  // MANEJADORES DE VALORES Y ARCHIVOS
  // Manejador genérico para inputs de texto, select y textareas
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador del archivo PDF de cárdex
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setFileError('Solo se permiten archivos en formato PDF.');
        setCardexFile(null);
      } else {
        setCardexFile(file);
      }
    }
  };

  // MANEJADOR DE ENVÍO Y VALIDACIONES PREVIAS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError('');
    setFileError('');

    // Validación de todos los campos obligatorios
    const hasEmptyFields = !formData.grado || !formData.promedio || !formData.curp.trim() || !formData.edad || !formData.direccion.trim() || !formData.localidad.trim() || !formData.cp.trim() || !formData.telefono.trim() || !formData.correo.trim() || !formData.motivo.trim() || !cardexFile;
    
    if (hasEmptyFields) {
      setFormError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const promedioVal = parseFloat(formData.promedio);
    const edadVal = parseInt(formData.edad);

    // Validación de promedio numérico
    if (isNaN(promedioVal) || promedioVal < 6 || promedioVal > 10) {
      setFormError('Por favor, ingresa un promedio válido entre 6.0 y 10.0.');
      return;
    }

    // Validación de promedio mínimo
    if (promedioVal < convocatoria.promedioMinimo) {
      setFormError(`Tu promedio (${promedioVal}) es menor al promedio mínimo requerido (${convocatoria.promedioMinimo}) para esta convocatoria.`);
      return;
    }

    // Validación de edad mínima
    if (isNaN(edadVal) || edadVal < 16) {
      setFormError('La edad mínima para postularse es 16 años.');
      return;
    }

    // Creación del objeto FormData para envío multipart/form-data
    const data = new FormData();
    data.append('grado', formData.grado);
    data.append('promedio', formData.promedio);
    data.append('curp', formData.curp);
    data.append('edad', formData.edad);
    data.append('direccion', formData.direccion);
    data.append('localidad', formData.localidad);
    data.append('cp', formData.cp);
    data.append('telefono', formData.telefono);
    data.append('correo', formData.correo);
    data.append('motivo', formData.motivo);
    data.append('cardexPdf', cardexFile);

    await onSubmit(data);
  };

  // Clases CSS de Tailwind reutilizables
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  // UI
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Información del programa de beca */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-[#8B2B91]">{convocatoria.nombre}</h3>
        <p className="text-sm text-gray-600">Tipo: {convocatoria.tipo} | Promedio mínimo: {convocatoria.promedioMinimo}</p>
      </div>

      {/* Contenedor de Error General */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {formError}
        </div>
      )}

      {/* Campos del Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Grado / Semestre</label>
          <select 
            name="grado" 
            value={formData.grado} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.grado 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          >
            <option value="">Selecciona tu grado/semestre</option>
            <option value="1ro">1ro</option>
            <option value="2do">2do</option>
            <option value="3ro">3ro</option>
            <option value="4to">4to</option>
            <option value="5to">5to</option>
            <option value="6to">6to</option>
            <option value="7mo">7mo</option>
            <option value="8vo">8vo</option>
          </select>
          {errors.grado && <p className="text-red-500 text-xs mt-1">{errors.grado}</p>}
        </div>
        <div>
          <label className={labelClass}>Promedio</label>
          <input 
            type="number" 
            name="promedio" 
            value={formData.promedio} 
            onChange={handleChange} 
            step="0.1" 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.promedio 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.promedio && <p className="text-red-500 text-xs mt-1">{errors.promedio}</p>}
        </div>
        <div>
          <label className={labelClass}>CURP</label>
          <input 
            type="text" 
            name="curp" 
            value={formData.curp} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.curp 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.curp && <p className="text-red-500 text-xs mt-1">{errors.curp}</p>}
        </div>
        <div>
          <label className={labelClass}>Edad</label>
          <input 
            type="number" 
            name="edad" 
            value={formData.edad} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.edad 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Dirección</label>
          <input 
            type="text" 
            name="direccion" 
            value={formData.direccion} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.direccion 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
        </div>
        <div>
          <label className={labelClass}>Localidad</label>
          <input 
            type="text" 
            name="localidad" 
            value={formData.localidad} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.localidad 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.localidad && <p className="text-red-500 text-xs mt-1">{errors.localidad}</p>}
        </div>
        <div>
          <label className={labelClass}>Código Postal</label>
          <input 
            type="text" 
            name="cp" 
            value={formData.cp} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.cp 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.cp && <p className="text-red-500 text-xs mt-1">{errors.cp}</p>}
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input 
            type="tel" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.telefono 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
        </div>
        <div>
          <label className={labelClass}>Correo Electrónico</label>
          <input 
            type="email" 
            name="correo" 
            value={formData.correo} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.correo 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Motivo de la solicitud</label>
          <textarea 
            name="motivo" 
            value={formData.motivo} 
            onChange={handleChange} 
            rows={4} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
              errors.motivo 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.motivo && <p className="text-red-500 text-xs mt-1">{errors.motivo}</p>}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Subir Cárdex (PDF)</label>
          <input 
            type="file" 
            name="cardexPdf" 
            accept="application/pdf"
            onChange={handleFileChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-[#8B2B91] hover:file:bg-purple-100 ${
              errors.cardexFile
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[#8B2B91]'
            }`}
          />
          {errors.cardexFile && <p className="text-sm text-red-600 mt-1 font-medium">{errors.cardexFile}</p>}
          <p className="text-xs text-gray-400 mt-1">Selecciona tu archivo de cárdex en formato PDF de tu computadora.</p>
        </div>
      </div>

      {/* Botones de Envío y Cancelación */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#8B2B91] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7a2580] transition disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default SolicitudForm;