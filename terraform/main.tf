# ===== VPC Network =====
resource "yandex_vpc_network" "network-1" {
  name = "from-terraform-network"
}

resource "yandex_vpc_subnet" "subnet-1" {
  name           = "from-terraform-subnet"
  zone           = "ru-central1-a"
  network_id     = "${yandex_vpc_network.network-1.id}"
  v4_cidr_blocks = ["10.2.0.0/16"]
}

# ===== PostgreSQL =====
resource "yandex_mdb_postgresql_cluster" "project-postgres" {
  name                = "project-postgres"
  environment         = "PRODUCTION"
  network_id          = "${yandex_vpc_network.network-1.id}"
  deletion_protection = false 

  config {
    version = "15"
    resources {
      resource_preset_id = "s3-c2-m8"
      disk_type_id       = "network-ssd"
      disk_size          = 10
    }
  }

  host {
    zone             = "${yandex_vpc_subnet.subnet-1.zone}"
    name             = "postgesql-host"

    subnet_id        = "${yandex_vpc_subnet.subnet-1.id}"
    assign_public_ip = true
  }
}


resource "yandex_mdb_postgresql_database" "CodeRev" {
  cluster_id = "${yandex_mdb_postgresql_cluster.project-postgres.id}"
  name       = "CodeRev"
  owner      = "postgresql"
  depends_on = [
    yandex_mdb_postgresql_user.postgresql
  ]
}

resource "yandex_mdb_postgresql_user" "postgresql" {
  cluster_id = "${yandex_mdb_postgresql_cluster.project-postgres.id}"
  name       = "postgresql"
  password   = "postgresql"
}

# ===== Service Account for Kubernetes =====
resource "yandex_iam_service_account" "k8s_sa" {
  name        = "coderev-k8s-sa"
  description = "Service account for coderev Kubernetes cluster"
}

resource "yandex_resourcemanager_folder_iam_binding" "k8s_sa_binding" {
  folder_id = var.folder_id
  role      = "admin"

  members = [
    "serviceAccount:${yandex_iam_service_account.k8s_sa.id}"
  ]
}

# ===== Kubernetes Cluster =====
resource "yandex_kubernetes_cluster" "zonal_cluster" {
  name        = "interview-service"

  network_id = "${yandex_vpc_network.network-1.id}"

  master {
    version = "1.29"
    zonal {
      zone      = "${yandex_vpc_subnet.subnet-1.zone}"
      subnet_id = "${yandex_vpc_subnet.subnet-1.id}"
    }

    public_ip = true
  }

  service_account_id      = yandex_iam_service_account.k8s_sa.id
  node_service_account_id = yandex_iam_service_account.k8s_sa.id
}

# ===== Kubernetes Node Group =====
resource "yandex_kubernetes_node_group" "node-group" {
  cluster_id  = yandex_kubernetes_cluster.zonal_cluster.id
  name        = "node-group"

  description = "description"
  version     = "1.29"

  instance_template {
    platform_id = "standard-v3"

    network_interface {
      nat        = true
      subnet_ids = ["${yandex_vpc_subnet.subnet-1.id}"]
    }

    resources {
      memory = 4
      cores  = 2
    }

    boot_disk {
      type = "network-hdd"
      size = 96
    }

    scheduling_policy {
      preemptible = false
    }

    container_runtime {
      type = "containerd" # may be "docker"
    }
  }

  scale_policy {
    auto_scale {
      initial = 1
      max = 3
      min = 1
    }
  }

  allocation_policy {
    location {
      zone = "ru-central1-a"
    }
  }
}

# ===== Container Registry (если используется) =====
resource "yandex_container_registry" "coderev_registry" {
  name = "coderev-registry"
  folder_id = var.folder_id
}

# ===== Docker build =====
#resource "null_resource" "docker-build-backend" {
# provisioner "local-exec" {
#   command = "docker build .. -t cr.yandex/${yandex_container_registry.coderev_registry.id}/backend:latest && docker push cr.yandex/${yandex_container_registry.coderev_registry.id}/backend:latest"
# }
#}
#resource "null_resource" "docker-build-frontend" {
# provisioner "local-exec" {
#   command = "docker build ../client -t cr.yandex/${yandex_container_registry.coderev_registry.id}/frontend:latest && docker push cr.yandex/${yandex_container_registry.coderev_registry.id}/frontend:latest"
# }
#}
# ===== Docker push =====
#resource "null_resource" "docker-push-backend" {
# provisioner "local-exec" {
#   command = ""
# }
#}
#resource "null_resource" "docker-push-frontend" {
# provisioner "local-exec" {
#   command = ""
# }
#}


# ===== Kubernetes pods =====
#resource "null_resource" "kubectl-config" {
# provisioner "local-exec" {
#   command = "yc managed-kubernetes cluster get-credentials --id ${yandex_kubernetes_cluster.zonal_cluster.id} --external"
# }
#}
resource "null_resource" "deploy-app" {
  provisioner "local-exec" {
    command = "kubectl config unset clusters && kubectl config unset users && kubectl config unset contexts && yc managed-kubernetes cluster get-credentials --id ${yandex_kubernetes_cluster.zonal_cluster.id} --external && kubectl create namespace coderev && export POSTGRESQL_HOST=${yandex_mdb_postgresql_cluster.project-postgres.host[0].fqdn}; docker build --build-arg POSTGRESQL_HOST=$POSTGRESQL_HOST .. -t cr.yandex/${yandex_container_registry.coderev_registry.id}/backend:latest && docker push cr.yandex/${yandex_container_registry.coderev_registry.id}/backend:latest && docker build ../client -t cr.yandex/${yandex_container_registry.coderev_registry.id}/frontend:latest && docker push cr.yandex/${yandex_container_registry.coderev_registry.id}/frontend:latest && export CLUSTER_HOST=${yandex_container_registry.coderev_registry.id}; envsubst < ../ci/coderev.yaml | kubectl apply -f - && kubectl apply -f ../ci/load-balancer.yaml && kubectl apply -f ../ci/config-map.yaml && kubectl apply -f ../ci/config-map.yaml"
  }
}
#resource "null_resource" "coderev-pod" {
# provisioner "local-exec" {
#   command = "export CLUSTER_HOST=${yandex_container_registry.coderev_registry.id}; envsubst < ../ci/coderev.yaml | kubectl apply -f - && kubectl apply -f ../ci/load-balancer.yaml && kubectl apply -f ../ci/config-map.yaml && kubectl apply -f ../ci/config-map.yaml"
# }
#}
#resource "null_resource" "load-balancer-pod" {
# provisioner "local-exec" {
#   command = ""
# }
#}
#resource "null_resource" "configmap-pod" {
# provisioner "local-exec" {
#   command = ""
# }
#}
