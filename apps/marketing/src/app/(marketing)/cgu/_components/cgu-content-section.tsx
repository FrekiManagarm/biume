"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CGUContentSection() {
  return (
    <section className="py-24 bg-linear-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto prose prose-lg dark:prose-invert"
        >
          <div className="space-y-16">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Bienvenue sur Biume. Les présentes Conditions Générales
                d&apos;Utilisation (ci-après « CGU ») régissent votre
                utilisation de notre application et des services associés. En
                accédant à notre plateforme ou en l&apos;utilisant, vous
                acceptez d&apos;être lié par ces conditions. Si vous
                n&apos;acceptez pas ces conditions, veuillez ne pas utiliser
                notre service.
              </p>
            </section>

            {/* Définitions */}
            <section id="definitions" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Définitions
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Pour les besoins des présentes CGU, les termes suivants ont la
                  signification qui leur est donnée ci-après :
                </p>
                <ul className="list-none space-y-3 ml-0">
                  <li className="pl-6 border-l-2 border-primary/30">
                    <strong className="text-foreground">Service</strong> :
                    désigne l&apos;application Biume et toutes ses
                    fonctionnalités, accessible via le web ou applications
                    mobiles.
                  </li>
                  <li className="pl-6 border-l-2 border-primary/30">
                    <strong className="text-foreground">Utilisateur</strong> :
                    désigne toute personne physique ou morale qui accède ou
                    utilise le Service.
                  </li>
                  <li className="pl-6 border-l-2 border-primary/30">
                    <strong className="text-foreground">Compte</strong> :
                    désigne l&apos;espace personnel créé lors de
                    l&apos;inscription permettant d&apos;accéder aux
                    fonctionnalités du Service.
                  </li>
                  <li className="pl-6 border-l-2 border-primary/30">
                    <strong className="text-foreground">Contenu</strong> :
                    désigne l&apos;ensemble des données, textes, images,
                    documents et autres éléments partagés via le Service.
                  </li>
                  <li className="pl-6 border-l-2 border-primary/30">
                    <strong className="text-foreground">
                      Professionnel de santé animale
                    </strong>{" "}
                    : désigne les ostéopathes animaliers, naturopathes
                    animaliers, masseurs animaliers, praticiens shiatsu et
                    autres professionnels de santé animale utilisant le Service
                    dans le cadre de leur activité professionnelle.
                  </li>
                </ul>
              </div>
            </section>

            {/* Inscription et compte */}
            <section id="inscription" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Inscription et compte
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Pour utiliser certaines fonctionnalités de notre Service, vous
                  devez créer un compte. Lors de l&apos;inscription, vous vous
                  engagez à :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fournir des informations exactes, complètes et à jour</li>
                  <li>
                    Maintenir la confidentialité de vos informations de
                    connexion
                  </li>
                  <li>
                    Assumer la responsabilité de toutes les activités effectuées
                    sous votre compte
                  </li>
                  <li>
                    Nous informer immédiatement en cas d&apos;utilisation non
                    autorisée de votre compte
                  </li>
                </ul>
                <p>
                  Nous nous réservons le droit de suspendre ou de résilier votre
                  compte si nous estimons que vous avez violé ces conditions.
                </p>
              </div>
            </section>

            {/* Utilisation du service */}
            <section id="utilisation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Utilisation du service
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Vous vous engagez à utiliser notre Service conformément aux
                  présentes conditions et à toutes les lois applicables. Il vous
                  est strictement interdit de :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Utiliser le Service d&apos;une manière qui pourrait
                    l&apos;endommager, le désactiver ou en altérer le
                    fonctionnement
                  </li>
                  <li>
                    Tenter d&apos;accéder à des parties du Service auxquelles
                    vous n&apos;êtes pas autorisé à accéder
                  </li>
                  <li>
                    Utiliser le Service pour distribuer des virus, logiciels
                    malveillants ou contenus illégaux
                  </li>
                  <li>
                    Collecter des informations sur d&apos;autres utilisateurs
                    sans leur autorisation expresse
                  </li>
                  <li>
                    Utiliser le Service à des fins de spam, de harcèlement ou
                    d&apos;activités frauduleuses
                  </li>
                  <li>
                    Reproduire, dupliquer, copier ou revendre une partie du
                    Service sans autorisation
                  </li>
                </ul>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section id="propriete" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Propriété intellectuelle
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Le Service, incluant son contenu original, ses fonctionnalités
                  et son interface, est la propriété exclusive de Biume et est
                  protégé par les lois françaises et internationales sur le
                  droit d&apos;auteur, les marques, les brevets et autres droits
                  de propriété intellectuelle.
                </p>
                <p>
                  Vous conservez tous les droits sur le contenu que vous créez
                  et partagez via notre Service. Toutefois, en utilisant le
                  Service, vous nous accordez une licence mondiale, non
                  exclusive, pour utiliser, stocker et traiter votre contenu
                  uniquement dans le but de fournir et d&apos;améliorer nos
                  services.
                </p>
              </div>
            </section>

            {/* Protection des données */}
            <section id="donnees" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Protection des données
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  La protection de vos données personnelles est une priorité
                  pour Biume. Nous nous engageons à respecter le Règlement
                  Général sur la Protection des Données (RGPD) et à protéger la
                  confidentialité de vos informations.
                </p>
                <p>
                  Pour en savoir plus sur la façon dont nous collectons,
                  utilisons et protégeons vos données, veuillez consulter notre{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline font-medium"
                  >
                    Politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* Limitation de responsabilité */}
            <section id="responsabilite" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Limitation de responsabilité
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Le Service est fourni « en l&apos;état » et « selon
                  disponibilité ». Nous nous efforçons de maintenir le Service
                  accessible et fonctionnel, mais nous ne garantissons pas
                  qu&apos;il sera exempt d&apos;erreurs ou toujours disponible.
                </p>
                <p>
                  Dans les limites autorisées par la loi, Biume ne pourra être
                  tenu responsable des dommages directs ou indirects résultant
                  de l&apos;utilisation ou de l&apos;impossibilité
                  d&apos;utiliser le Service, y compris la perte de données, de
                  profits ou d&apos;opportunités commerciales.
                </p>
              </div>
            </section>

            {/* Modifications des conditions */}
            <section id="modifications" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Modifications des conditions
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nous nous réservons le droit de modifier ces CGU à tout
                  moment. Les modifications entreront en vigueur dès leur
                  publication sur cette page. La date de dernière mise à jour
                  sera indiquée en haut de ce document.
                </p>
                <p>
                  Nous vous encourageons à consulter régulièrement cette page
                  pour rester informé des éventuelles modifications. Votre
                  utilisation continue du Service après la publication de
                  modifications constitue votre acceptation de ces changements.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Contact
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Si vous avez des questions, des préoccupations ou des
                  commentaires concernant ces Conditions Générales
                  d&apos;Utilisation, n&apos;hésitez pas à nous contacter :
                </p>
                <div className="p-6 bg-primary/5 border-l-4 border-primary rounded-lg">
                  <p className="font-medium text-foreground mb-2">
                    Email de contact
                  </p>
                  <Link
                    href="mailto:contact@biume.com"
                    className="text-primary hover:underline text-lg font-semibold"
                  >
                    contact@biume.com
                  </Link>
                </div>
                <p>
                  Notre équipe s&apos;engage à vous répondre dans les meilleurs
                  délais.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
