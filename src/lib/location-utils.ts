import locations from "@/assets/locations.json";
import { Region, Woreda, Zone } from "@/types/location";

interface JsonRegion {
  name: string;
  zones: { name: string; woredas: string[] }[];
}
const jRegions: JsonRegion[] = locations.regions;

export function getAllRegions(): Region[] {
  const regions: Region[] = [];

  for (const jRegion of jRegions) {
    const region: Region = { name: jRegion.name, zones: [] };

    for (const jZone of jRegion.zones) {
      const zone: Zone = { name: jZone.name, woredas: [], region };

      for (const woredaName of jZone.woredas) {
        zone.woredas.push({ name: woredaName, zone, hasDuplicate: false });
      }

      region.zones.push(zone);
    }
    regions.push(region);
  }

  const counter: { [key: string]: number } = {};

  for (const region of regions) {
    for (const zone of region.zones) {
      for (const woreda of zone.woredas) {
        if (counter[woreda.name]) {
          woreda.hasDuplicate = true;
        }
        counter[woreda.name] = (counter[woreda.name] || 0) + 1;
      }
    }
  }

  return regions;
}

export function getAllWoredas(): Woreda[] {
  const regions = getAllRegions();
  const woredas: Woreda[] = [];

  for (const region of regions) {
    for (const zone of region.zones) {
      for (const woreda of zone.woredas) {
        woredas.push(woreda);
      }
    }
  }

  return woredas;
}
export function getAllZones(): Zone[] {
  const regions = getAllRegions();
  const zones: Zone[] = [];

  for (const region of regions) {
    for (const zone of region.zones) {
      zones.push(zone);
    }
  }

  return zones;
}
