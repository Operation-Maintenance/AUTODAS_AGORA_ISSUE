// ==UserScript==
// @name         OplusM AUTODAS AGORA ISSUE
// @namespace    https://oplusm.fr/
// @version      1.3
// @description  Envoie semi-automatique de prevenance Agora.
// @author       Adi Lasri
// @match        https://agora2.cellnextelecom.com/*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/Operation-Maintenance/AUTODAS_AGORA_ISSUE/main/autodas.js
// @downloadURL https://raw.githubusercontent.com/Operation-Maintenance/AUTODAS_AGORA_ISSUE/main/autodas.js 
// ==/UserScript===

(function () {
    //'use strict';
  
    window.addEventListener('load', function () {
      setTimeout(function () {
            // Liste des départements et des zones
          const zones = {
            "06": "MED", "08": "NOE", "09": "SWT", "10": "NOE", "11": "MED",
            "12": "SWT", "13": "MED", "14": "WST", "16": "SWT", "17": "SWT",
            "18": "WST", "19": "SWT", "20": "MED", "21": "CTA", "22": "WST",
            "23": "SWT", "24": "SWT", "25": "CTA", "26": "CTA", "27": "WST",
            "28": "WST", "29": "WST", "30": "MED", "31": "SWT", "32": "SWT",
            "33": "SWT", "34": "MED", "35": "WST", "36": "WST", "37": "WST",
            "38": "CTA", "39": "CTA", "40": "SWT", "41": "WST", "42": "CTA",
            "43": "CTA", "44": "WST", "45": "WST", "46": "SWT", "47": "SWT",
            "49": "WST", "50": "WST", "51": "NOE", "52": "NOE", "53": "WST",
            "54": "NOE", "55": "NOE", "56": "WST", "57": "NOE", "58": "CTA",
            "59": "NOE", "60": "NOE", "61": "WST", "62": "NOE", "63": "CTA",
            "64": "SWT", "65": "SWT", "66": "MED", "67": "NOE", "68": "NOE",
            "69": "CTA", "70": "NOE", "71": "CTA", "72": "WST", "73": "CTA",
            "74": "CTA", "75": "IDF", "76": "WST", "77": "IDF", "78": "IDF",
            "79": "SWT", "80": "NOE", "81": "SWT", "82": "SWT", "83": "MED",
            "84": "MED", "85": "WST", "86": "SWT", "87": "SWT", "88": "NOE",
            "89": "CTA", "90": "NOE", "91": "IDF", "92": "IDF", "93": "IDF",
            "94": "IDF", "95": "IDF", "01": "CTA", "02": "NOE", "03": "CTA",
            "04": "MED", "05": "MED", "07": "CTA", "15": "CTA", "48": "CTA"
          };
  
  
          // Récupérer les informations spécifiques
          const idSite = getValueByLabel("Site");
          const dep = idSite.substring(3, 5); // Extraction des deux caractères après "FR-"
          const zone = zones[dep] || "Zone inconnue";
          let Operat = getValueByLabel("Fournisseur du site (Portfolio)");
          if (Operat === "BYT") {
              Operat = "Bouygues Telecom";}
          const typeinter = getValueByLabel("Sous-type");
          const titleElement = document.querySelector('.sapMText.sapUiSelectable.titleGreenNC.sapUiTinyMarginEnd');
          const descbefore = titleElement ? titleElement.textContent.trim() : null;
          const desc = descbefore.includes(" - ") ? descbefore.split(" - ")[1].trim() : null;
          const MTO = descbefore.includes(" - ") ? descbefore.split(" - ")[0].trim() : null;
        // Prompt des informations récupéré dans la console
        console.log("Code site: " + idSite +"Departement : "+ dep +" Zone :" + zone +" Operateur : "+ Operat + " Type inter : " + typeinter + " description : " + desc + " MTO : " + MTO);
        // Appelez la fonction pour la première fois
        sendEmail(idSite, typeinter, Operat, desc, MTO,zone);
  
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
    function sendEmail(idSite, typeinter, Operat, desc, MTO,zone ) {
      let formattedTypeinter = typeinter.replace(/&/g, "et");
      var recipient = ''; // pas de destinataire automatique
      var subject = "Cellnex telecom  /  "+ formattedTypeinter + ' / ADRESSE / ' + idSite +" / "+ MTO + " / "+ zone; // sujet du mail
      var body = 'Bonjour,%0A%0AJe vous contacte au sujet du site situé au [ADRESSE], où nous intervenons dans le cadre de la maintenance des équipements '+Operat +'%0A%0A';
      if (typeinter === "Cles & badges") {
          body += "Nos mainteneurs nous signalent que nous ne disposons pas des accès nécessaires pour nos interventions. Pourriez-vous mettre à notre disposition un trousseau de manière définitive afin qu’il soit placé dans notre boîte à clés sécurisée sur site ? %0A A défaut, pourriez-vous me transmettre les coordonnées du gardien sur site svp ?  %0A%0A";
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
  