// ==UserScript==
// @name         OplusM AUTODAS AGORA ISSUE
// @namespace    https://oplusm.fr/
// @version      1.1
// @description  Envoie semi-automatique de prevenance Agora
// @author       Adi Lasri
// @match        https://agora2.cellnextelecom.com/*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/Operation-Maintenance/AUTODAS_AGORA_ISSUE/main/autodas.js
// @downloadURL https://raw.githubusercontent.com/Operation-Maintenance/AUTODAS_AGORA_ISSUE/main/autodas.js 
// ==/UserScript===

(function () {
    //'use strict';
  
    window.addEventListener('load', function () {
      setTimeout(function () { // récuparation des data nécéssaire
        //const desc = document.getElementById('__text244');
  
  
  
          // Récupérer les informations spécifiques
          const idSite = getValueByLabel("Site");
          let Operat = getValueByLabel("Fournisseur du site (Portfolio)");
          if (Operat === "BYT") {
              Operat = "Bouygues Telecom";}
          const typeinter = getValueByLabel("Sous-type");
          const titleElement = document.querySelector('.sapMText.sapUiSelectable.titleGreenNC.sapUiTinyMarginEnd');
          const descbefore = titleElement ? titleElement.textContent.trim() : null;
          const desc = descbefore.includes(" - ") ? descbefore.split(" - ")[1].trim() : null;
          const MTO = descbefore.includes(" - ") ? descbefore.split(" - ")[0].trim() : null;
        // Prompt des informations récupéré dans la console
        console.log("Code site: " + idSite +" Operateur : "+ Operat + " Type inter : " + typeinter + " description : " + desc + " MTO : " + MTO);
        // Appelez la fonction pour la première fois
        sendEmail(idSite, typeinter, Operat, desc, MTO);
  
      }, 15000);
     });
  
            function getValueByLabel(label) {
              const labelElement = [...document.querySelectorAll('.sapMLabel')].find(el => el.textContent.trim() === label);
              if (labelElement) {
                  const valueElement = labelElement.closest('.sapUiFormElementLbl').nextElementSibling.querySelector('.sapMText');
                  return valueElement ? valueElement.textContent.trim() : null;
              }
              return null;
          }
  
    // fonction de création du mail
    function sendEmail(idSite, typeinter, Operat, desc, MTO ) {
      let formattedTypeinter = typeinter.replace(/&/g, "et");
      var recipient = ''; // pas de destinataire automatique
      var subject = "Cellnex telecom  /  "+ formattedTypeinter + ' / ADRESSE / ' + idSite +" / "+ MTO; // sujet du mail
      var body = 'Bonjour,%0A%0AJe vous contacte au sujet du site situé au [ADRESSE], où nous intervenons dans le cadre de la maintenance des équipements '+Operat +'%0A%0A';
      if (typeinter === "Cles & badges") {
          body += "Nos mainteneurs nous signalent que nous ne disposons pas des accès nécessaires pour nos interventions. Pourriez-vous mettre à notre disposition un trousseau de manière définitive afin qu’il soit placé dans notre boîte à clés sécurisée sur site ?%0A%0A";
      } else if (typeinter === "Skydome") {
          body += "Nos mainteneurs nous signalent que le système d’ouverture du skydome est endommagé. Pouvez-vous missionner votre mainteneur afin de le remettre en conformité ? %0A%0A";
      } else {
          // Pour tout autre type d'intervention
          body += "Nos mainteneurs nous signalent la raison suivante : " + desc+ ".%0A%0A";
      }
      body += 'Dans l’attente de votre retour.%0A';
      body += 'Cordialement,%0A';
  
  
      //var mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); // encapsulage dans le mailto
      var urlOWA = "https://outlook.office365.com/owa/?path=/mail/action/compose&to=&subject="+subject+"&body="+body;
      var senderEmail = "guichet.acces@cellnextelecom.fr"; // Remplacez par l'adresse e-mail de l'expéditeur que vous souhaitez utiliser
      urlOWA += "&from=" + encodeURIComponent(senderEmail);
  
      window.open(urlOWA, "_blank");
      //window.location.href = mailtoLink;
    };
  })();
  