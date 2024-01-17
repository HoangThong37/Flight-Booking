package dev.ronin_engineer.software_development.domain.auth.repository;

import dev.ronin_engineer.software_development.domain.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

}
