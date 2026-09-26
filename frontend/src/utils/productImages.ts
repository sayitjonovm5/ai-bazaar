export function getProductImageUrl(name: string = "", category: string = ""): string {
  const text = `${name} ${category}`.toLowerCase();

  if (text.includes("avtobenzin") || text.includes("benzin") || text.includes("ai-80") || text.includes("ai-91") || text.includes("ai-92") || text.includes("ai-95") || text.includes("a-80") || text.includes("a-92") || text.includes("a-95") || text.includes("yoqilg'i")) {
    return "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Gasoline_in_mason_jar.jpg/600px-Gasoline_in_mason_jar.jpg";
  }
  
  if (text.includes("qurilish") || text.includes("sement") || text.includes("g'isht")) {
    return "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/USMC-110806-M-IX060-148.jpg/600px-USMC-110806-M-IX060-148.jpg";
  }

  if (text.includes("metallurgiya") || text.includes("armatura") || text.includes("po'lat") || text.includes("mis") || text.includes("katod")) {
    return "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/A_bunch_of_rebar.jpg/600px-A_bunch_of_rebar.jpg";
  }

  if (text.includes("qishloq") || text.includes("oziq-ovqat") || text.includes("bug'doy") || text.includes("un") || text.includes("shakar") || text.includes("paxta") || text.includes("yog'")) {
    return "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/PivotWithDrops.JPG/600px-PivotWithDrops.JPG";
  }

  if (text.includes("polimerlar") || text.includes("plastmassa") || text.includes("polietilen") || text.includes("polipropilen")) {
    return "https://upload.wikimedia.org/wikipedia/commons/b/b2/Plastic_household_items.jpg";
  }

  if (text.includes("kimyoviy") || text.includes("kislota") || text.includes("selitra") || text.includes("sulfat") || text.includes("soda") || text.includes("karbamid")) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flasks.jpg/600px-Flasks.jpg";
  }

  return "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/L%C3%A5da_-_Livrustkammaren_-_107142.tif/lossy-page1-600px-L%C3%A5da_-_Livrustkammaren_-_107142.tif.jpg";
}
