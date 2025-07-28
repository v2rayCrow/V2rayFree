const configsDiv = document.getElementById("configs");
const countrySelect = document.getElementById("country");
const protocolSelect = document.getElementById("protocol");

async function loadConfigs() {
  const proto = protocolSelect.value;
  const folder = `configs/${proto}`;
  const response = await fetch(folder);
  const countryList = await fetchCountryList(proto);

  countrySelect.innerHTML = `<option value="all">همه کشورها</option>`;
  countryList.forEach(c => {
    countrySelect.innerHTML += `<option value="${c}">${c}</option>`;
  });

  loadConfigsFor(proto, "all");
}

async function fetchCountryList(proto) {
  const response = await fetch(`configs/${proto}`);
  const files = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(files, 'text/html');
  const links = Array.from(doc.querySelectorAll('a'));
  return links
    .map(link => link.textContent.replace("/", "").trim())
    .filter(name => name.length > 1);
}

async function loadConfigsFor(proto, country) {
  configsDiv.innerHTML = "در حال بارگذاری...";
  const folder = `configs/${proto}`;
  const path = country === "all" ? null : `${folder}/${country}/configs.txt`;

  if (path) {
    try {
      const res = await fetch(path);
      const text = await res.text();
      showConfigs(text.split("\n").filter(Boolean));
    } catch {
      configsDiv.innerHTML = "کانفیگی پیدا نشد.";
    }
  } else {
    configsDiv.innerHTML = "لطفاً کشور را انتخاب کنید.";
  }
}

function showConfigs(list) {
  configsDiv.innerHTML = "";
  list.forEach(config => {
    const box = document.createElement("div");
    box.className = "config-box";
    box.innerHTML = `
      <code>${config}</code>
      <br>
      <button class="copy-btn" onclick="copyConfig('${config}')">کپی</button>
    `;
    configsDiv.appendChild(box);
  });
}

function copyConfig(text) {
  navigator.clipboard.writeText(text).then(() => alert("کپی شد ✅"));
}

protocolSelect.addEventListener("change", () => loadConfigs());
countrySelect.addEventListener("change", () => {
  const proto = protocolSelect.value;
  const country = countrySelect.value;
  loadConfigsFor(proto, country);
});

document.getElementById("randomBtn").addEventListener("click", async () => {
  const proto = protocolSelect.value;
  const country = countrySelect.value;
  const folder = `configs/${proto}/${country}/configs.txt`;
  try {
    const res = await fetch(folder);
    const text = await res.text();
    const lines = text.split("\n").filter(Boolean);
    const rand = lines[Math.floor(Math.random() * lines.length)];
    alert("کانفیگ تصادفی کپی شد ✅");
    navigator.clipboard.writeText(rand);
  } catch {
    alert("خطا در دریافت کانفیگ");
  }
});

// بارگزاری اولیه
loadConfigs();
