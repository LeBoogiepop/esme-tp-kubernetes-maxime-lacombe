# Instructions de connexion AKS - MaximeESME

## Informations du cluster

- **Nom du cluster**: aks-MaximeESME
- **Resource Group**: rg-aks-MaximeESME
- **Region**: West Europe
- **Nombre de noeuds**: 2

## Configuration kubectl

### Option 1: Utiliser le fichier kubeconfig fourni

```bash
# Definir la variable d'environnement KUBECONFIG
export KUBECONFIG=credentials-etudiants\MaximeESME-kubeconfig.yaml

# Verifier la connexion
kubectl get nodes
```

### Option 2: Fusionner avec votre kubeconfig existant

```bash
# Sauvegarder votre config existante
cp ~/.kube/config ~/.kube/config.backup

# Fusionner les configurations
KUBECONFIG=~/.kube/config:credentials-etudiants\MaximeESME-kubeconfig.yaml kubectl config view --flatten > ~/.kube/config.tmp
mv ~/.kube/config.tmp ~/.kube/config

# Changer de contexte
kubectl config use-context aks-MaximeESME
```

### Option 3: Utiliser Azure CLI (si vous avez acces)

```bash
az aks get-credentials --resource-group rg-aks-MaximeESME --name aks-MaximeESME
```

## Commandes de verification

```bash
# Verifier les noeuds
kubectl get nodes

# Verifier les namespaces
kubectl get namespaces

# Verifier les pods systeme
kubectl get pods -n kube-system
```

## Deploiement de test

```bash
# Creer un deploiement nginx de test
kubectl create deployment nginx-test --image=nginx

# Exposer le service
kubectl expose deployment nginx-test --port=80 --type=LoadBalancer

# Verifier le statut
kubectl get service nginx-test
```

## Nettoyage apres les tests

```bash
# Supprimer le test
kubectl delete deployment nginx-test
kubectl delete service nginx-test
```

---

**Date de creation**: 2025-11-03 11:50:39
**Cluster valide jusqu'a**: [A definir selon la politique de retention]
