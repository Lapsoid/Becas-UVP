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
  cardexUrl: string;
}

interface SolicitudFormProps {
  convocatoria: Convocatoria;
  onSubmit: (data: SolicitudFormData) => Promise<void>;
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
    cardexUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'promedio' ? parseFloat(value) || 0
             : name === 'edad' ? parseInt(value) || 0
             : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
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
          <label className={labelClass}>URL del Cárdex (PDF)</label>
          <input type="url" name="cardexUrl" value={formData.cardexUrl} onChange={handleChange} placeholder="https://..." className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Sube tu cárdex a Cloudinary y pega la URL aquí</p>
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
