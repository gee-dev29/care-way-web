export function splitToChips(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function hospitalLocation(hospital?: {
  ward?: string;
  lga?: string;
  state?: string;
}): string {
  if (!hospital) return '';
  const parts = [
    hospital.ward,
    hospital.lga ? `${hospital.lga} LGA` : undefined,
    hospital.state,
  ];
  return parts.filter(Boolean).join(', ');
}

export function hospitalKey(hospital?: {
  hospitalId?: string;
  medicalFacilityHospitalId?: string;
  id?: string;
  facilityName?: string;
  ward?: string;
  lga?: string;
  state?: string;
}): string {
  if (!hospital) return '';
  return (
    hospital.hospitalId ??
    hospital.medicalFacilityHospitalId ??
    hospital.id ??
    [hospital.facilityName, hospital.ward, hospital.lga, hospital.state]
      .filter(Boolean)
      .join('|')
  );
}
