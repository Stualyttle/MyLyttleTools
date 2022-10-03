const pgm1A = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const pgm1B = ["Appel", "Peer", "Banaan", "Kiwi", "Mango", "Ananas", "Meloen"]
const pgm2 = ["A", "B", "C", "D", "E", "F", "G"]

const classes = [pgm1A, pgm1B, pgm2];

const result = classes.map((clas) => {
  // randomize array
  const shuffledClass = clas.sort(() => Math.random() - 0.5);

  // give partners
  return shuffledClass.map((item, index) => ({
      user: item,
      buysFor: shuffledClass[index + 1] ?? shuffledClass[0]
    }));
});

console.log(result);
