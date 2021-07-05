import { AbilityBuilder } from "@casl/ability";

export default function defineAbilitiesFor() {
  return AbilityBuilder.define((can) => {
    const role = 'Admin';

    switch (role) {
      case 'Admin':
        can('route', 'Devices');
        can('route', 'Drone');
        break;
    }
  });
}
