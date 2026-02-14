export const formatearFecha = (fecha: string) => {
    const [datePart, timePart] = fecha.split(', ');
    const [day, month, year] = datePart.split('/'); // Corregido: el formato es DD/MM/YYYY
    const [hours, minutes, seconds] = timePart.split(':');
    
    const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
    );
    
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};