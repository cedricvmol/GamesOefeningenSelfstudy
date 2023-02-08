class GefietsteKilometers {
  constructor(jaar, aantalKilometers, bedragPerKilometer) {
    this.jaar = jaar;
    this.aantalKilometers = aantalKilometers;
    this.bedragPerKilometer = bedragPerKilometer;
  }

  get jaar() {
    return this._jaar;
  }
  get aantalKilometers() {
    return this._aantalKilometers;
  }
  get bedragPerKilometer() {
    return this._bedragPerKilometer;
  }

  set jaar(value) {
    this._jaar = value;
  }
  set aantalKilometers(value) {
    this._aantalKilometers = value;
  }
  set bedragPerKilometer(value) {
    this._bedragPerKilometer = value;
  }
}

class GefietsteKilometersRepository {
  constructor() {
    this.repository = [];
    this.opvullen();
  }

  get repository() {
    return this._repository;
  }
  set repository(value) {
    this._repository = value;
  }

  geefJaren() {
    const jarenSet = this._repository.reduce((result, value, index, array) => {
      return result.add(value.jaar);
    }, new Set());
    return [...jarenSet];
  }

  geefGefietsteKilometersVoorEenJaar(jaar) {
    return this._repository.filter((value, index, array) => {
      return value.jaar === jaar;
    })[0].aantalKilometers;
  }

  wijzigGefietsteKilometers(jaar, waarden) {
    this.geefGefietsteKilometersVoorEenJaar(jaar).aantalKilometers = waarden;
  }

  voegToe(jaar, aantalKilometers, bedragPerKilometer) {
    this._repository.push(
      new GefietsteKilometers(jaar, aantalKilometers, bedragPerKilometer)
    );
  }

  opvullen() {
    this.voegToe(
      2015,
      [107, 109, 183, 154, 118, 136, 104, 178, 189, 98, 107, 145],
      0.2
    );
    this.voegToe(
      2016,
      [123, 145, 178, 113, 174, 158, 149, 133, 167, 120, 166, 142],
      0.2
    );
    this.voegToe(
      2017,
      [156, 128, 129, 160, 190, 145, 155, 198, 120, 130, 140, 150],
      0.21
    );
  }
}

class GefietsteKilometersComponent {
  constructor(window) {
    this.gefietsteKilometersRepository = new GefietsteKilometersRepository();
    this.storage = window.localStorage;
  }

  get gefietsteKilometersRepository() {
    return this._gefietsteKilometersRepository;
  }
  get storage() {
    return this._storage;
  }

  set gefietsteKilometersRepository(value) {
    this._gefietsteKilometersRepository = value;
  }
  set storage(value) {
    this._storage = value;
  }

  /* De keuzelijst met jaren dynamisch genereren */
  jarenToHtml() {
    this._gefietsteKilometersRepository.geefJaren().forEach(value => {
      const optionElement = document.createElement('option');
      optionElement.setAttribute('value', value);
      const optionTekst = document.createTextNode(value);
      optionElement.appendChild(optionTekst);
      document.getElementById('jaar').appendChild(optionElement);
    });
  }

  /* De tekstvakken dynamisch invullen */
  gefietsteKilometersToHtml(jaar) {
    const waarden = this._gefietsteKilometersRepository.geefGefietsteKilometersVoorEenJaar(
      jaar
    );
    waarden.forEach((value, index, array) => {
      document.getElementById(index).value = value;
    });
  }

  getJaarFromStorage() {
    if (this._storage.getItem('jaarGefietsteKilometers')) {
      document.getElementById('jaar').value = this._storage.getItem(
        'jaarGefietsteKilometers'
      );
    }
  }

  setJaarInStorage() {
    try {
      this._storage.setItem(
        'jaarGefietsteKilometers',
        document.getElementById('jaar').value
      );
    } catch (e) {
      if (e === QUOTA_EXCEEDED_ERR) alert('Out of storage!');
    }
  }
}

function init() {
  const gefietsteKilometersCompent = new GefietsteKilometersComponent(this);
  const jaarSelect = document.getElementById("jaar");

  gefietsteKilometersCompent.jarenToHtml();
  gefietsteKilometersCompent.getJaarFromStorage();
  gefietsteKilometersCompent.gefietsteKilometersToHtml(
    parseInt(jaarSelect.value)
  );
  document.getElementById('jaar').onchange = () => {
    gefietsteKilometersCompent.gefietsteKilometersToHtml(
      parseInt(jaarSelect.value)
    );
    gefietsteKilometersCompent.setJaarInStorage();
  };
  document.getElementById('opslaan').onclick = () => {
    // kan dit korter?
    let nieuw = [];
    for (let i = 0; i < 12; i++) {
      nieuw.push(parseInt(document.getElementById(i).value));
    }
    gefietsteKilometersCompent.gefietsteKilometersRepository.wijzigGefietsteKilometers(
      parseInt(jaarSelect.value),
      nieuw
    );
  };
}

window.onload = () => {
  init();
};
