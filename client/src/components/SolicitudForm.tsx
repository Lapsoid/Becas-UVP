import { useState } from 'react';

interface Convocatoria {
  id: number;
  nombre: string;
  tipo: string;
  promedioMinimo: number;
}

interface SolicitudFormData {
  grado: string;
  promedio: number;
  curp: string;
  edad: number;
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

export const SolicitudForm = ({ convocatoria, onSubmit, onCancel, loading }: SolicitudFormProps) => {
  const [formData, setFormData] = useState<SolicitudFormData>({
    grado: '',
    promedio: 0,
    curp: '',
    edad: 0,
    direccion: '',
    localidad: '',
    cp: '',
    telefono: '',
    correo: '',
    motivo: '',
  });

  const [cardexFile, setCardexFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'promedio' ? parseFloat(value) || 0
             : name === 'edad' ? parseInt(value) || 0
             : value
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardexFile) {
      setFileError('Por favor, selecciona tu cárdex en formato PDF.');
      return;
    }

    const data = new FormData();
    data.append('grado', formData.grado);
    data.append('promedio', formData.promedio.toString());
    data.append('curp', formData.curp);
    data.append('edad', formData.edad.toString());
    data.append('direccion', formData.direccion);
    data.append('localidad', formData.localidad);
    data.append('cp', formData.cp);
    data.append('telefono', formData.telefono);
    data.append('correo', formData.correo);
    data.append('motivo', formData.motivo);
    data.append('cardexPdf', cardexFile);

    await onSubmit(data);
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-[#8B2B91]">{convocatoria.nombre}</h3>
        <p className="text-sm text-gray-600">Tipo: {convocatoria.tipo} | Promedio mínimo: {convocatoria.promedioMinimo}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Grado / Semestre</label>
          <input type="text" name="grado" value={formData.grado} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Promedio</label>
          <input type="number" name="promedio" value={formData.promedio} onChange={handleChange} step="0.1" min="0" max="10" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>CURP</label>
          <input type="text" name="curp" value={formData.curp} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Edad</label>
          <input type="number" name="edad" value={formData.edad} onChange={handleChange} min="1" required className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Dirección</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Localidad</label>
          <input type="text" name="localidad" value={formData.localidad} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Código Postal</label>
          <input type="text" name="cp" value={formData.cp} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Correo Electrónico</label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Motivo de la solicitud</label>
          <textarea name="motivo" value={formData.motivo} onChange={handleChange} required rows={4} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Subir Cárdex (PDF)</label>
          <input 
            type="file" 
            name="cardexPdf" 
            accept="application/pdf"
            onChange={handleFileChange} 
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-[#8B2B91] hover:file:bg-purple-100"
          />
          {fileError && <p className="text-sm text-red-600 mt-1 font-medium">{fileError}</p>}
          <p className="text-xs text-gray-400 mt-1">Selecciona tu archivo de cárdex en formato PDF de tu computadora.</p>
        </div>
      </div>

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
