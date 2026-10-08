import connectToDatabase, { isDatabaseConnected } from "@/lib/db/mongodb";
import Settings, { ISettings } from "@/models/Settings";
import { DEFAULT_SETTINGS, GlobalSettingsType } from "@/lib/default-settings";
import { revalidatePath } from "next/cache";

export async function getGlobalSettings(): Promise<GlobalSettingsType> {
  try {
    const conn = await connectToDatabase();
    if (!conn || !isDatabaseConnected()) {
      return DEFAULT_SETTINGS;
    }

    const settingsDoc = await Settings.findOne().lean();
    if (!settingsDoc) {
      return DEFAULT_SETTINGS;
    }

    return {
      institutionName: settingsDoc.institutionName || DEFAULT_SETTINGS.institutionName,
      institutionShort: settingsDoc.institutionShort || DEFAULT_SETTINGS.institutionShort,
      department: settingsDoc.department || DEFAULT_SETTINGS.department,
      centreName: settingsDoc.centreName || DEFAULT_SETTINGS.centreName,
      centreShort: settingsDoc.centreShort || DEFAULT_SETTINGS.centreShort,
      eventName: settingsDoc.eventName || DEFAULT_SETTINGS.eventName,
      eventEdition: settingsDoc.eventEdition || DEFAULT_SETTINGS.eventEdition,
      eventTagline: settingsDoc.eventTagline || DEFAULT_SETTINGS.eventTagline,
      eventStartDate: settingsDoc.eventStartDate?.toISOString?.() || DEFAULT_SETTINGS.eventStartDate,
      eventEndDate: settingsDoc.eventEndDate?.toISOString?.() || DEFAULT_SETTINGS.eventEndDate,
      venueName: settingsDoc.venueName || DEFAULT_SETTINGS.venueName,
      venueAddress: settingsDoc.venueAddress || DEFAULT_SETTINGS.venueAddress,
      venueMapUrl: settingsDoc.venueMapUrl || DEFAULT_SETTINGS.venueMapUrl,
      contactEmail: settingsDoc.contactEmail || DEFAULT_SETTINGS.contactEmail,
      contactPhone: settingsDoc.contactPhone || DEFAULT_SETTINGS.contactPhone,
      registrationOpen: settingsDoc.registrationOpen ?? DEFAULT_SETTINGS.registrationOpen,
      registrationDeadline: settingsDoc.registrationDeadline?.toISOString?.() || DEFAULT_SETTINGS.registrationDeadline,
      maxCapacity: settingsDoc.maxCapacity ?? DEFAULT_SETTINGS.maxCapacity,
      minTeamSize: settingsDoc.minTeamSize ?? DEFAULT_SETTINGS.minTeamSize,
      maxTeamSize: settingsDoc.maxTeamSize ?? DEFAULT_SETTINGS.maxTeamSize,
      announcement: settingsDoc.announcement || DEFAULT_SETTINGS.announcement,
      navigation: settingsDoc.navigation?.length ? settingsDoc.navigation : DEFAULT_SETTINGS.navigation,
      footer: settingsDoc.footer || DEFAULT_SETTINGS.footer,
      socialLinks: settingsDoc.socialLinks || DEFAULT_SETTINGS.socialLinks,
    };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateGlobalSettings(data: Partial<GlobalSettingsType>): Promise<GlobalSettingsType> {
  const conn = await connectToDatabase();
  if (!conn || !isDatabaseConnected()) {
    Object.assign(DEFAULT_SETTINGS, data);
    revalidatePath("/", "layout");
    return DEFAULT_SETTINGS;
  }

  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({
      ...DEFAULT_SETTINGS,
      ...data,
    });
  } else {
    Object.assign(settings, data);
  }

  await settings.save();
  revalidatePath("/", "layout");
  return getGlobalSettings();
}
