document.addEventListener("DOMContentLoaded", () => {
    // Vérifier si le paiement a été validé avant d'accéder à la prise de rendez-vous
    const isPaymentValidated = localStorage.getItem("paymentValidated");
    if (!isPaymentValidated && !window.location.pathname.includes("payment.html")) {
        window.location.href = "/payment.html";
    }

    document.getElementById("submit").addEventListener("click", async () => {
        const summary = document.getElementById("summary").value;
        const description = document.getElementById("description").value;
        const start = document.getElementById("start").value;
        const end = document.getElementById("end").value;

        if (!summary || !start || !end) {
            document.getElementById("message").textContent = "Veuillez remplir tous les champs.";
            return;
        }

        const event = {
            summary,
            description,
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString()
        };

        try {
            const response = await fetch("/add-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById("message").textContent = "Rendez-vous ajouté avec succès !";
            } else {
                document.getElementById("message").textContent = "Erreur : " + data.error;
            }
        } catch (error) {
            console.error("Erreur lors de la connexion au serveur :", error);
            document.getElementById("message").textContent = "Erreur lors de la connexion au serveur.";
        }
    });

    // Vérifier si le paiement a été validé avant d'accéder à la prise de rendez-vous
    if (window.location.pathname.includes("index.html")) {
        const isPaymentValidated = localStorage.getItem("paymentValidated");
        if (!isPaymentValidated) {
            window.location.href = "/payment.html";
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const payButton = document.getElementById("pay-button");

    if (payButton) {
        payButton.addEventListener("click", () => {
            const cardNumber = document.getElementById("card-number").value;
            const expiryDate = document.getElementById("expiry-date").value;
            const cvv = document.getElementById("cvv").value;

            if (!cardNumber || !expiryDate || !cvv) {
                document.getElementById("message").textContent = "❌ Veuillez remplir tous les champs.";
                return;
            }

            document.getElementById("message").textContent = "⏳ Vérification du paiement...";
            
            // Simulation d'un paiement réussi après 2 secondes
            setTimeout(() => {
                document.getElementById("message").textContent = "✅ Paiement validé ! Redirection...";
                
                // Stocker le paiement validé en localStorage
                localStorage.setItem("paymentValidated", "true");

                // Redirection vers la prise de rendez-vous
                window.location.href = "/index.html";
            }, 2000);
        });
    }

    // Vérifier si le paiement a été validé avant d'accéder à la prise de rendez-vous
    if (window.location.pathname.includes("index.html")) {
        const isPaymentValidated = localStorage.getItem("paymentValidated");
        if (!isPaymentValidated) {
            window.location.href = "/payment.html";
        }
    }
});

