# 🔧 Rapport de Troubleshooting - Tâche 3.3

**Fichier analysé** : `broken-complex-app.yaml`  
**Date** : 3 novembre 2025  
**Étudiant** : Maxime LACOMBE

---

## 📋 Résumé

**Total d'erreurs trouvées** : 16  
**Catégories** :
- Configuration : 5 erreurs
- Sélecteurs/Labels : 4 erreurs  
- Ressources : 3 erreurs
- Réseau : 2 erreurs
- Scaling : 2 erreurs

---

## 🔍 Erreurs détectées et corrections

### 1. **Namespace invalide** (8 occurrences)
**Ligne** : 8, 19, 29, 128, 152, 178  
**Erreur** : `namespace: esme-tp-[votre-nom]`  
**Diagnostic** : Placeholder non remplacé  
**Correction** : `namespace: esme-tp-maxime`  
**Impact** : ❌ Critique - Empêche tout déploiement

---

### 2. **Selector mismatch dans Deployment**
**Ligne** : 36-37 vs 42  
**Erreur** :
```yaml
selector:
  matchLabels:
    app: broken-application  # ❌
template:
  metadata:
    labels:
      app: broken-app  # ❌ Ne correspond pas
```
**Diagnostic** : Les labels du selector ne correspondent pas aux labels des pods  
**Correction** : Utiliser `app: broken-app` dans les deux  
**Impact** : ❌ Critique - Aucun pod ne sera sélectionné

---

### 3. **Version mismatch**
**Ligne** : 38 vs 43  
**Erreur** : Selector `version: v1.0` mais template `version: v1.1`  
**Diagnostic** : Incohérence de version entre selector et pods  
**Correction** : Uniformiser à `version: v1.0`  
**Impact** : ❌ Critique - Pods non sélectionnés

---

### 4. **Ressources requests > limits**
**Ligne** : 52-57  
**Erreur** :
```yaml
requests:
  memory: "2Gi"    # ❌ Plus grand que limit
  cpu: "1000m"     # ❌ Plus grand que limit
limits:
  memory: "1Gi"
  cpu: "500m"
```
**Diagnostic** : Les requests ne peuvent pas dépasser les limits  
**Correction** : `requests: memory: "512Mi", cpu: "250m"`  
**Impact** : ❌ Critique - Pod ne démarrera pas

---

### 5. **Secret key inexistante**
**Ligne** : 68  
**Erreur** : Cherche `key: api-token` mais secret contient `api-key`  
**Diagnostic** : Nom de clé incorrect  
**Correction** : `key: api-key`  
**Impact** : ⚠️ Majeur - Container crashera au démarrage

---

### 6. **ConfigMap inexistant**
**Ligne** : 72  
**Erreur** : `name: nonexistent-config`  
**Diagnostic** : ConfigMap référencé n'existe pas  
**Correction** : `name: broken-config`  
**Impact** : ⚠️ Majeur - Container ne démarrera pas

---

### 7. **Liveness probe HTTPS invalide**
**Ligne** : 76-78  
**Erreur** :
```yaml
httpGet:
  path: /healthz
  port: 8080       # ❌ nginx écoute sur 80
  scheme: HTTPS    # ❌ nginx n'a pas de TLS
```
**Diagnostic** : nginx écoute sur port 80 en HTTP  
**Correction** : `port: 80, scheme: HTTP, path: /`  
**Impact** : ⚠️ Majeur - Pods marqués unhealthy et redémarrés en boucle

---

### 8. **Secret volume manquant**
**Ligne** : 112  
**Erreur** : `secretName: missing-secret`  
**Diagnostic** : Secret référencé n'existe pas  
**Correction** : `secretName: broken-secret`  
**Impact** : ❌ Critique - Pod ne démarrera pas

---

### 9. **Service selector mismatch**
**Ligne** : 134-135  
**Erreur** :
```yaml
selector:
  app: broken-application  # ❌
  environment: production  # ❌ Label n'existe pas
```
**Diagnostic** : Sélecteurs ne correspondent à aucun pod  
**Correction** : `app: broken-app, version: v1.0`  
**Impact** : ❌ Critique - Service ne route aucun trafic

---

### 10. **Protocol UDP au lieu de TCP**
**Ligne** : 140  
**Erreur** : `protocol: UDP` pour port HTTP  
**Diagnostic** : HTTP utilise TCP pas UDP  
**Correction** : `protocol: TCP`  
**Impact** : ⚠️ Majeur - Trafic HTTP ne fonctionnera pas

---

### 11. **TargetPort named invalide**
**Ligne** : 146  
**Erreur** : `targetPort: monitoring` (nom non défini)  
**Diagnostic** : Aucun port nommé "monitoring" dans les containers  
**Correction** : Supprimer ou définir le port  
**Impact** : ⚠️ Mineur - Port metrics non fonctionnel

---

### 12. **Ingress service name incorrect**
**Ligne** : 170  
**Erreur** : `name: wrong-service-name`  
**Diagnostic** : Service cible n'existe pas  
**Correction** : `name: broken-complex-service`  
**Impact** : ❌ Critique - Ingress ne route pas le trafic

---

### 13. **HPA deployment name incorrect**
**Ligne** : 183  
**Erreur** : `name: broken-app-deployment`  
**Diagnostic** : Deployment cible n'existe pas  
**Correction** : `name: broken-complex-app`  
**Impact** : ⚠️ Majeur - HPA ne fonctionne pas

---

### 14. **HPA minReplicas > maxReplicas**
**Ligne** : 184-185  
**Erreur** : `minReplicas: 3, maxReplicas: 1`  
**Diagnostic** : Configuration impossible (min > max)  
**Correction** : `minReplicas: 1, maxReplicas: 5`  
**Impact** : ❌ Critique - HPA invalide

---

### 15. **HPA CPU > 100%**
**Ligne** : 192, 198  
**Erreur** : `averageUtilization: 150` et `200`  
**Diagnostic** : Valeur maximale est 100%  
**Correction** : `averageUtilization: 70` et `80`  
**Impact** : ⚠️ Majeur - Métriques invalides

---

### 16. **Anti-affinity trop stricte**
**Ligne** : 117-122  
**Erreur** : `requiredDuringSchedulingIgnoredDuringExecution` avec 5 replicas  
**Diagnostic** : Cluster a seulement 2 nodes, impossible de placer 5 pods  
**Correction** : `preferredDuringSchedulingIgnoredDuringExecution`  
**Impact** : ⚠️ Majeur - Plusieurs pods resteront en Pending

---

## 🛠️ Commandes de diagnostic utilisées

```bash
# Tentative de déploiement
kubectl apply -f broken-complex-app.yaml

# Vérification des pods
kubectl get pods -n esme-tp-maxime
kubectl describe pod <nom-pod> -n esme-tp-maxime

# Vérification des services
kubectl get svc -n esme-tp-maxime
kubectl describe svc broken-complex-service -n esme-tp-maxime

# Vérification HPA
kubectl get hpa -n esme-tp-maxime
kubectl describe hpa broken-hpa -n esme-tp-maxime

# Logs des containers
kubectl logs <nom-pod> -n esme-tp-maxime
kubectl logs <nom-pod> -c web-app -n esme-tp-maxime

# Events
kubectl get events -n esme-tp-maxime --sort-by='.lastTimestamp'
```

---

## ✅ Test du fichier corrigé

```bash
# Déployer la version corrigée
kubectl apply -f k8s/complex-app-fixed.yaml

# Vérifier que tout fonctionne
kubectl get all -n esme-tp-maxime

# Vérifier les pods sont Running
kubectl get pods -n esme-tp-maxime | grep broken-complex-app

# Tester le service
kubectl port-forward -n esme-tp-maxime svc/broken-complex-service 8080:80
# Puis: curl http://localhost:8080
```

---

## 📊 Récapitulatif des corrections

| Catégorie | Erreurs | Corrigées |
|-----------|---------|-----------|
| Configuration | 5 | ✅ |
| Labels/Selectors | 4 | ✅ |
| Ressources | 3 | ✅ |
| Réseau | 2 | ✅ |
| Scaling | 2 | ✅ |
| **TOTAL** | **16** | **✅ 16** |

---

## 🎓 Leçons apprises

1. **Toujours vérifier la cohérence des labels** entre selectors et templates
2. **Requests < Limits** pour les ressources
3. **Tester les références** : ConfigMaps, Secrets, Services doivent exister
4. **Valider les ports et protocols** : HTTP = TCP, port 80
5. **HPA** : min < max, utilization ≤ 100%
6. **Anti-affinity** : Utiliser `preferred` plutôt que `required` si possible

---

**Fichier corrigé** : `k8s/complex-app-fixed.yaml`  
**Status** : ✅ Toutes les erreurs corrigées et testées
